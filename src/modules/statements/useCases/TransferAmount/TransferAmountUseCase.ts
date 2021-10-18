import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferAmountError } from "./TransferAmountError";

interface IRequest {
    user_id: string
    amount: number
    description: string
    id_destino: string
}

@injectable()
export class TransferAmountUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StatementsRepository')
        private statementsRepository: IStatementsRepository
    ) {}

    async execute({user_id, amount, description, id_destino}: IRequest) {

        const userDestino = await this.usersRepository.findById(id_destino)

        if (!userDestino) {
            throw new TransferAmountError.UserNotFound
        }

        const { balance: balanceUserRemetente } = await this.statementsRepository.getUserBalance({user_id, with_statement: false})

        if (balanceUserRemetente < amount) {
            throw new TransferAmountError.InsufficientFunds
        }

        const statementOperationRemetente = await this.statementsRepository.create({
            user_id,
            type: 'withdraw' as OperationType,
            amount,
            description
        });

        const statementOperationDestinatario = await this.statementsRepository.create({
            user_id: id_destino,
            type: 'deposit' as OperationType,
            amount,
            description
        });

        return { statementOperationRemetente, statementOperationDestinatario }
    }
}