import { Injectable, NotFoundException} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from './prisma.service';
import { PaginationDto } from 'src/common/dto/pagination';




@Injectable()
export class ProductsService  {
  constructor(private prisma: PrismaService) 
  {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
       data: createProductDto
    });
  }


  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 10);
    
    const totalPage = await this.prisma.product.count({
      where: { avialable: true },
    });
    const lastPage = Math.ceil(totalPage  / safeLimit);


    return {
      data: await this.prisma.product.findMany({
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
      where: { avialable: true },
    }),
    meta:{
      total: totalPage,
      page:page,
      lastPage: lastPage
    }
    };
  }

  findOne(id: number) {
    const product = this.prisma.product.findFirst({
      where: { id: id, avialable: true },
    });

    if(!product){
      throw new NotFoundException(`Product with ID ${id} not found`); 
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;
    return this.prisma.product.update({
      where: { id: id },
      data: data
    });
  }


  async remove(id: number) {
    await this.findOne(id);
    
    

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

    return product;


  }
}

