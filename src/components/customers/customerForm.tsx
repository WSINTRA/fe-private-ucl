import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import moment from "moment";
import { customer } from "../../types/dataTypes";
import { useState } from 'react';
import { Button } from '@mui/material';
import AlertDialogSlide from './nextServiceDatePrompt';

interface customerForm {
    editM: boolean;
    customer: customer;
    tableCell?: any;
    updateCell?: any;
}

export const CustomerForm = ({ editM, customer, tableCell }: customerForm) => {
    console.log(editM, customer, tableCell)
    const emptyCustomer: customer = {
        active_status: false,
        address: '',
        contact_number: '',
        first_name: '',
        last_name: '',
        first_service_date: '',
        next_service_date: null,
        notes: ''
    }
    const [editCustomer, setEditCustomer] = useState(customer || emptyCustomer)
    const [openServiceDialog, setOpenServiceDialog] = useState(false)

    if (editM || (editCustomer === emptyCustomer)) {
        console.log(editCustomer)
        return <>
            <AlertDialogSlide open={openServiceDialog} setOpen={setOpenServiceDialog} />
            <Button variant='outlined' onClick={() => setOpenServiceDialog(true)}>Add next Service Date
            </Button></>
    }
    return <>
        <Box>
            <Typography>Active Status: {editCustomer.active_status ? 'Active' : 'Not Active'}</Typography>
            <Typography>Address: {editCustomer.address}</Typography>
            <Typography>Contact Tel: {editCustomer.contact_number}</Typography>
            <Typography>Contact Name: {editCustomer.first_name + ' ' + editCustomer.last_name} </Typography>
            <Typography>Next Service Due: {moment(editCustomer.next_service_date).format('hh:mm - MMMM Do YYYY')}</Typography>
            <Typography>First Service: {moment(editCustomer.first_service_date).format('MMMM Do YYYY')} </Typography>
            <Divider />
            <Typography>Notes: {editCustomer.notes}</Typography>
        </Box>
    </>
}