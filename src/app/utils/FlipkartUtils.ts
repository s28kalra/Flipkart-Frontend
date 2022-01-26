export class FlipkartUtils {

    static storage: Storage = localStorage;

    static setCustomerEmail(email: string) {
        this.storage.setItem("userEmail", email);
    }

    static getCustomerEmail(): string {
        return (this.storage.getItem("userEmail")!);
    }

    static setCustomerName(name: string) {
        this.storage.setItem("userName", name);
    }

    static getCustomerName(): string {
        return this.storage.getItem("userName")!;
    }

    static removeCustomer() {
        this.storage.removeItem("userEmail");
        this.storage.removeItem("userName");
    }

}