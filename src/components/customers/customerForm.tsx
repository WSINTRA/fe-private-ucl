import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import moment from "moment";
import { customer } from "../../types/dataTypes";
import { useState, useContext } from 'react';
import { Button, Container, TextField } from '@mui/material';
import NextServiceDatePrompt from './nextServiceDatePrompt';
import { saveNextDate } from '../../services/api';
import { AuthContext } from '../../services/authContext';

interface customerForm {
    editM: boolean;
    customer: customer;
    tableCell?: any;
    updateCell?: any;
}

export const CustomerForm = ({ editM, customer, tableCell, updateCell }: customerForm) => {
    // console.log(editM, customer, tableCell)

    const { token } = useContext(AuthContext);
    // console.log(token)
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
    const [notes, setNotes] = useState(editCustomer.notes)

    const updateTableAndView = (updatedCustomer: customer) => {
        type resKeys = keyof customer;
        Object.keys(updatedCustomer).forEach((key) => {
            const value = updatedCustomer[key as resKeys];
            updateCell(tableCell.index, key, value);
        });
    };

    const saveDate = async (dateValue: Date, recurring: boolean) => {
        const res = await saveNextDate(token, editCustomer.id as number, dateValue)
        updateTableAndView(res)
        setEditCustomer(res)
        setOpenServiceDialog(false);
    }
    const saveNotes = () => {
        console.log('Save notes', notes);
    }
    if (editCustomer === emptyCustomer) {
        return <>
            Something</>
    }

    if (editM) {
        return <>
            <Container>
                <Box>
                    <Typography variant="h5" sx={{ marginBottom: '2vh' }}>Next Service for {editCustomer.first_name + " " + editCustomer.last_name}- {moment(editCustomer.next_service_date).format('hh:mm:a MMMM Do YYYY')}</Typography>
                    <NextServiceDatePrompt handleSave={saveDate} open={openServiceDialog} setOpen={setOpenServiceDialog} />
                    <Button variant='outlined' onClick={() => setOpenServiceDialog(true)}>Add next Service Date
                    </Button>
                </Box>
                <Box sx={{ marginTop: '2vh' }}>
                    <TextField
                        id="outlined-notes"
                        label="Notes"
                        multiline
                        rows={8}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </Box>
                <Button onClick={saveNotes} variant='outlined'>Save notes</Button>
            </Container>
        </>
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