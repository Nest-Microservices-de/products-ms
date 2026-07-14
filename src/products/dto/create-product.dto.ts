import { IsNumber, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

/**Contrato que debe cumplir los datos que recibire  */
export class CreateProductDto {
    @IsString()
    public name: string;

    /**debe se un numero pero debe tener un maximo de decimal que recibire  */
    @IsNumber({ maxDecimalPlaces: 4 },)
    @Min(0)
    @Type(() => Number)
    public price: number;
}


