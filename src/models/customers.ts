import z from "zod";
import { iranNationalCode, persianPhone } from "../utils/validations";
import { v4 as uuid } from "uuid"

export const customerSchema = z.object({
    name: z.string().min(4).max(50),
    familyName: z.string().min(4).max(50),
    phoneNumber: persianPhone,
    nationalCode: iranNationalCode,
    address: z.string().min(30).max(300),
});

export const customerUpdateSchema = customerSchema.extend({
    id: z.uuidv4(),
});

export default class Customer {
    constructor(
        public id: string,
        public name: string,
        public familyName: string,
        public phoneNumber: string,
        public nationalCode: string,
        public address: string,
        public pendingUntil?: Date
    ) { }

    public static create({ address, familyName, name, nationalCode, phoneNumber, id }: z.infer<typeof customerSchema> & { id?: string }) {
        return new Customer(
            id || uuid(),
            name,
            familyName,
            phoneNumber,
            nationalCode,
            address,
            new Date(Date.now() + 5 * 60 * 1000)
        )
    }

    public update({ address, familyName, name, nationalCode, phoneNumber }: z.infer<typeof customerSchema>) {
        this.name = name;
        this.familyName = familyName;
        this.address = address;
        this.nationalCode = nationalCode;
        this.phoneNumber = phoneNumber;
        this.pendingUntil = new Date(Date.now() + 5 * 60 * 1000); // extend lock on update
    }
}