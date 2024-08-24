import { BookingDetails } from "./booking.model";

export class Payment{
   
    bookingId: number;
    paymentType: number;
    transactionNo: string;
    ticketNumber: number;
    qr: string;
    description: string;
    price: number;
}

export class TicketDetail{
    id: number;
    cinema: string;
    showDate: string;
    showTime: string;
    subName: string;
    title: string;
    photo: string;
    duration: string;
    ticketNumber: string;
    price: number;
    transactionNo: string;
    room: string;
    bookingDetails: BookingDetails[];
}

export class PaymentRequest {
    amount: number;
    orderInfo: string;
    returnUrl: string;
}
