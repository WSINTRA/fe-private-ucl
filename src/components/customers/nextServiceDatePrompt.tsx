import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import moment from 'moment';
import Stack from '@mui/material/Stack';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface dialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleSave: (dateValue: Date, recurring: boolean) => void
}
export default function NextServiceDatePrompt({ open, setOpen, handleSave }: dialogProps) {
    const [recurring, setRecurring] = React.useState(true)
    const [value, setValue] = React.useState<Date | null>(
        moment().toDate(),
    );

    const handleChange = (newValue: Date | null) => {
        setValue(newValue);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                sx={{ height: '90vh' }}
            >
                <DialogTitle>Choose Next Service Date</DialogTitle>
                <DialogContent sx={{ height: '45vh', padding: '10px' }} >
                    <Stack spacing={3}>
                        <DateTimePicker
                            label="Date&Time picker"
                            value={value}
                            onChange={handleChange}
                            renderInput={(params) => <TextField sx={{ marginTop: '24px' }} {...params} />}
                        />
                        <FormGroup sx={{ margin: 'auto' }}>
                            <FormControlLabel control={<Checkbox checked={recurring} onChange={() => setRecurring(!recurring)} />} label="2 weeks recurring" />
                        </FormGroup>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => handleSave(value as Date, recurring)}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}