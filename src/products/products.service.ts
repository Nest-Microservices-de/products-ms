import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from './prisma.service';
import { PaginationDto } from 'src/common/dto/pagination';
import { RpcException } from '@nestjs/microservices';




@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {


    const product = await this.prisma.product.create({
      data: createProductDto
    });

    if (!product) {
      throw new RpcException({
        status: 404,
        message: 'Product not create'
      });
    }
    return product;
  }


  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 10);

    const totalPage = await this.prisma.product.count({
      where: { avialable: true },
    });
    const lastPage = Math.ceil(totalPage / safeLimit);


    return {
      data: await this.prisma.product.findMany({
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        where: { avialable: true },
      }),
      meta: {
        total: totalPage,
        page: page,
        lastPage: lastPage
      }
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst(
      {
        where: {
          id: id,
          avialable: true
        },
      }
    );

    if (!product) {
      throw new RpcException({
        status: 404,
        message: `Product with ID ${id} not found`
      });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const isProduct = await this.findOne(id);

    if (!isProduct) {
      throw new RpcException({
        status: 404,
        message: `Product with ID ${id} not found`
      });
    }
    const product = this.prisma.product.update({
      where: { id: id },
      data: updateProductDto
    });

    if (!product) {
      throw new RpcException({
        status: 404,
        message: 'Product not update'
      });
    }

    return product;

  }


  async remove(id: number) {

    const isProduct = await this.findOne(id);

    if (!isProduct) {
      throw new RpcException({
        status: 404,
        message: `Product with ID ${id} not found`
      });
    }

    /**Este tipo de eliminacion es mejor no implementarala en 
     * arquitecturas de microservicios ya que si se elimina un producto y
     *  este es referenciado en otro microservicio, se perdera la referencia y puede generar errores.
     */

    /* return this.prisma.product.delete({
       where: {id:id}
     })*/

    /**En este caso se implementa una eliminacion logica,
     *  es decir, el producto no se elimina fisicamente de la base de datos,
     *  sino que se marca como no disponible. 
     * Esto permite mantener la integridad referencial y evitar errores en otros microservicios
     *  que puedan estar referenciando este producto. */

    const product = await this.prisma.product.update({
      where: { id: id },
      data: { avialable: false }
    })

    return { message: `Product with ID ${id} eliminated successfully`, product };

  }
}

