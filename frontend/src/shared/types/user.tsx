import { Payment } from "./payment";
import { Progress } from "./progress";

export type User = {
    firebaseId: string;
    email: string;
    isColorado: boolean;
    role:
        | "foster parent"
    | "certified kin"
    | "non-certified kin"
    | "staff"
    | "casa"
    | "teacher"
    | "county/cpa worker"
    | "speaker"
    | "former parent"
    | "caregiver";
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    certification: string;
    phone: string;
    progress: Progress[];
    payments: Payment[];
    cart: string[];
}
