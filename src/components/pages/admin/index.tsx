import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TextField, Checkbox } from '@material-ui/core';
import { useState, useEffect } from 'react';
import * as service from '../../../service';
import * as adminServices from '../../../service/admin';
import CheckCircle from '@material-ui/icons/CheckCircle'
import Cancel from '@material-ui/icons/Cancel'
import ToggleOn from '@material-ui/icons/ToggleOn'
import ToggleOff from '@material-ui/icons/ToggleOff'
import VerifiedUser from '@material-ui/icons/VerifiedUser'
import Remove from '@material-ui/icons/Remove'
import Add from '@material-ui/icons/Add'
import Modal from '@material-ui/core/Modal'
import ServerEdit from './ServerEdit';
import BasketEdit from './BasketEdit';
import { useCallback } from 'react';
import Link from '@material-ui/core/Link/Link';
import ChangePassword from './ChangePassword';
import { User, UserStatus } from '../../../types/user';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  link: {
    '&:visited': {
      color: 'blue'
    }
  }
});

const EMPTY_FORM_VALUES = {
  name: '',
  username: '',
  password: '',
  status: UserStatus.Active,
}

export default function Index() {
  const [mode, setMode] = useState<'view' | 'edit' | 'add'>('view')
  const [form, setForm] = useState(EMPTY_FORM_VALUES);
  const [users, setUsers] = useState<User[]>([]);
  const [dialogueState, setDialougeState] = useState<'server' | 'change-password' | 'basket' | 'closed'>('closed');
  const [selectedUserToEditServers, setSelectedUserToEditServers] = useState(null);
  const [selectedUserIdToEdit, setSelectedUserIdToEdit] = useState(null);
  const [selectedServerIdToEdit, setSelectedServerIdToEdit] = useState(null);

  const { name, username, password, status } = form
  const classes = useStyles();

  const handleCancel = () => {
    setForm(EMPTY_FORM_VALUES);
    setMode('view');
    setSelectedUserIdToEdit(null);
  }

  const handleAdd = () => {
    setMode('add');
  }

  const handleInputChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: (e.target.type === 'text' || e.target.type === 'password') ? e.target.value : e.target.checked
    })
  }

  const handleSubmit = async () => {
    if (mode === 'add') {
      await adminServices.addUser(name, username, password);
    }
    else if (mode === 'edit') {
      await adminServices.updateUser(selectedUserIdToEdit, name, username);
    }
    handleCancel();
    reset();
  }

  const reset = useCallback(
    async () => {
      const users = await service.loadUsers();
      setUsers(users);
    },
    [setUsers]
  );

  const toggleActive = async (id: string) => {
    await adminServices.toggleActive(id);
    reset();
  }

  const editServers = (user: User) => {
    setDialougeState('server');
    setSelectedUserToEditServers(user.id);
  }

  const handleOpenBasket = serverId => {
    setSelectedServerIdToEdit(serverId);
    setDialougeState('basket');
  }

  const gotoEditMode = (userId: string) => {
    setSelectedUserIdToEdit(userId);
    setForm({
      ...EMPTY_FORM_VALUES,
      ...users.find(x => x.id === userId)
    })
    setMode('edit');
  }

  const handleClose = () => {
    setDialougeState('closed');
    setSelectedServerIdToEdit(null);
    setSelectedUserIdToEdit(null);
  }

  const handleCloseBasketModal = () => {
    setDialougeState('server');
  }

  const gotoChangePasswordMode = (userId: string) => {
    setSelectedUserIdToEdit(userId);
    setDialougeState('change-password');
  }

  useEffect(
    () => {
      reset();
    },
    [reset]
  )

  const modalOpen = dialogueState !== 'closed';

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell> </TableCell>
            <TableCell>Index</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            {mode === 'edit' && <TableCell>Password</TableCell>}
            <TableCell>Active</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => {
            const active = user.status === UserStatus.Active;
            const editMode = mode === 'edit' && user.id === selectedUserIdToEdit;
            return (
              <TableRow key={user.id}>
                <TableCell width='25px'>
                  <IconButton><Remove /></IconButton>
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell component="th" scope="row">
                  {editMode ?
                    <TextField value={name} label='Name' name='name' onChange={handleInputChange} />
                    :
                    user.name
                  }
                </TableCell>
                <TableCell>
                  {editMode ?
                    <TextField value={username} label='Username' name='username' onChange={handleInputChange} />
                    :
                    user.username
                  }
                </TableCell>
                {mode === 'edit' && <TableCell>******</TableCell>}
                <TableCell>
                  {editMode ?
                    <Checkbox checked={status === UserStatus.Active} name='active' onChange={handleInputChange} />
                    :
                    active && <VerifiedUser color='action' />
                  }
                </TableCell>
                <TableCell align="center">
                  {editMode ?
                    <>
                      <IconButton
                        onClick={handleSubmit}
                      >
                        <CheckCircle color='primary' />
                      </IconButton>
                      <IconButton
                        onClick={handleCancel}
                      >
                        <Cancel color='secondary' />
                      </IconButton>
                    </>
                    :
                    <>
                      <IconButton
                        onClick={() => toggleActive(user.id)}
                        title={active ? 'Deactivate' : 'Activate'}
                      >
                        {active && <ToggleOn color='primary' />}
                        {!active && <ToggleOff color='secondary' />}
                      </IconButton>
                      <Link href='#' className={classes.link} onClick={() => editServers(user)}>Servers</Link> /
                      <Link href='#' className={classes.link} onClick={() => gotoEditMode(user.id)}>Edit</Link> /
                      <Link href='#' className={classes.link} onClick={() => gotoChangePasswordMode(user.id)}>Change password</Link> 
                    </>
                  }

                </TableCell>
              </TableRow>
            )
          })}
          <TableRow>
            {mode === 'add' && <>
              <TableCell>
                <IconButton
                ><Remove /></IconButton>
              </TableCell>
              <TableCell>#</TableCell>
              <TableCell><TextField value={name} label='Name' name='name' onChange={handleInputChange} /></TableCell>
              <TableCell><TextField value={username} label='Username' name='username' onChange={handleInputChange} /></TableCell>
              <TableCell><TextField value={password} label='Password' name='password' type='password' onChange={handleInputChange} /></TableCell>
              <TableCell><Checkbox checked={status === UserStatus.Active} name='active' onChange={handleInputChange} /></TableCell>
              <TableCell>
                <IconButton
                  onClick={handleSubmit}
                >
                  <CheckCircle color='primary' />
                </IconButton>
                <IconButton
                  onClick={handleCancel}
                >
                  <Cancel color='secondary' />
                </IconButton>
              </TableCell>
            </>}
            {
              mode === 'view' && <>
                <TableCell>
                  <IconButton
                    onClick={() => handleAdd()}
                  ><Add /></IconButton>
                </TableCell>
              </>
            }
          </TableRow>
        </TableBody>
      </Table>
      <Modal open={modalOpen}>
        <>
          {dialogueState === 'server' && <ServerEdit userId={selectedUserToEditServers} onOpenBasket={handleOpenBasket} onClose={handleClose} />}
          {dialogueState === 'basket' && <BasketEdit userId={selectedUserToEditServers} serverId={selectedServerIdToEdit} onClose={handleCloseBasketModal} />}
          {dialogueState === 'change-password' && <ChangePassword userId={selectedUserIdToEdit} onClose={handleClose} />}
        </>
      </Modal>
    </TableContainer>
  );

}