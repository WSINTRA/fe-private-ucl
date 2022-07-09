export type customer = {
    active_status: boolean
    address: string
    contact_number: string
    created_at?: string
    employee_id?: number
    employee_type?: null | string
    first_name: string
    first_service_date: string
    id?: number
    last_name: string
    next_service_date: null | string
    notes: string
    updated_at?: string
}

export type company = {
    company_name: string;
    address: string;
    logo_url: string;
    id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export type signUpPayload = {
    user: {
        name: string;
        email: string;
        password: string;
    };
    company: {
        company_name: string;
        address: string;
    }
};