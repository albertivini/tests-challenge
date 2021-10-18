import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferAmountUseCase } from "./TransferAmountUseCase";


export class TransferAmountController {

    async handle (req: Request, res: Response): Promise<Response> {

        const { id: user_id } = req.user;
        const { amount, description } = req.body;
        const { id_destino } = req.params

        const transferAmountUseCase = container.resolve(TransferAmountUseCase) 

        const { statementOperationDestinatario, statementOperationRemetente } = await transferAmountUseCase.execute({
            user_id ,
            amount,
            description,
            id_destino
        })

        return res.status(200).json({
            success: true,
            data: {
                statementOperationDestinatario, 
                statementOperationRemetente
            }
        })
    }
}