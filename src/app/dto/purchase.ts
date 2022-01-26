import { CartItem } from "../model/cart-item";
import { Address } from "./address";
import { Customer } from "./customer";
import { Transaction } from "./transaction";

export class Purchase {
    customer!: Customer;
    address!: Address;
    transaction!: Transaction;
    orderItems!: Array<CartItem>;
}