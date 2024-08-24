export class Account {
    id: number;
    username: string;
    password: string;
    email: string;
    phone: string;
    gender: string;
    birthday: string;
    securitycode: string;
    verify: number;
}

export class AccountSignup {
    username: string;
    password: string;
    email: string;
    phone: string;
    gender: string;
    birthday: string;
    securitycode: string;
    verify: number;
}



export class AccountLogin {
    email: string;
    password: string;
}

export class AccountUpdatePassword {
    password: string;
}

