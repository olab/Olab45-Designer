// @flow
import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { Delete as DeleteIcon } from '@material-ui/icons';
import { useState, useEffect } from 'react';

import { getGroups, getRoles } from '../../../services/api/defaults';
import OutlinedIdNameSelect from '../../../shared/components/OutlinedIdNameSelect';

import { TextEditorBlock, ContentTitle, ContentParagraph } from './styles';

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'groupName',
    headerName: 'Group',
    width: 300,
    valueGetter: (value, row) => {
      if (value.row.groupId == 0) {
        return '*';
      }
      return value.row.groupName;
    },
    flex: 1,
  },
  {
    field: 'roleName',
    headerName: 'Role',
    width: 300,
    valueGetter: (value, row) => {
      if (value.row.roleId == 0) {
        return '*';
      }
      return value.row.roleName;
    },
    flex: 1,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  paper: {
    width: 300,
    height: 230,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

export default function PermissionsTab({
  node: nodeProp,
  handleGroupRolesChange,
}) {
  const classes = useStyles();

  const [node, setNode] = useState(nodeProp);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(-1);
  const [selectedRoleId, setSelectedRoleId] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [checked, setChecked] = useState([]);
  const [nextIndex, setNextIndex] = useState(-1);

  const [openAlert, setOpenAlert] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    getGroups().then((data) => {
      data = [{ id: -1, name: '--Select--' }, { id: 0, name: '*' }, ...data];
      setGroups(data);

      getRoles().then((data) => {
        data = [{ id: -1, name: '--Select--' }, { id: 0, name: '*' }, ...data];
        setRoles(data);
        setLoading(false);
      });
    });
  }, []);

  const onSelectedGroup = (e: Event): void => {
    const { value, name } = e.target;
    setSelectedGroupId(value);
  };

  const onSelectedRole = (e: Event): void => {
    const { value, name } = e.target;
    setSelectedRoleId(value);
  };

  const onAddClicked = (e: Event): void => {
    const matchedRow = node.groupRoles.filter(
      (value) =>
        value.groupId == selectedGroupId && value.roleId == selectedRoleId,
    );
    if (matchedRow.length > 0) {
      setAlertSeverity('info');
      setAlertMessage('Group/role already exists');
      setOpenAlert(true);
      return;
    }

    const selectedGroup = groups.filter((grp) => grp.id === selectedGroupId);
    const selectedRole = roles.filter((role) => role.id === selectedRoleId);
    const newGroupRoles = [
      ...node.groupRoles,
      {
        id: nextIndex,
        groupId: selectedGroup[0].id,
        groupName: selectedGroup[0].name,
        roleId: selectedRole[0].id,
        roleName: selectedRole[0].name,
        nodeId: node.id,
      },
    ];

    setNode({ ...node, groupRoles: newGroupRoles });
    handleGroupRolesChange(newGroupRoles);
    setNextIndex(nextIndex - 1);
    setIsChanged(true);
  };

  const onDeleteClicked = (e: Event): void => {
    const matchedRow = node.groupRoles.filter(
      (value) =>
        value.groupId == (selectedGroupId == 0 ? null : selectedGroupId) &&
        value.roleId == (selectedRoleId == 0 ? null : selectedRoleId),
    );
    if (matchedRow.length == 0) {
      setAlertSeverity('error');
      setAlertMessage('Group/role does not exist');
      setOpenAlert(true);
      return;
    }

    const unmatchedRows = node.groupRoles.filter(
      (value) =>
        !(
          value.groupId == (selectedGroupId == 0 ? null : selectedGroupId) &&
          value.roleId == (selectedRoleId == 0 ? null : selectedRoleId)
        ),
    );

    setNode({ ...node, groupRoles: unmatchedRows });
    handleGroupRolesChange(unmatchedRows);

    setSelectedGroupId(-1);
    setSelectedRoleId(-1);

    setIsChanged(true);
  };

  const onRevertClicked = (e: Event): void => {
    setNode(nodeProp);
    handleGroupRolesChange(nodeProp.groupRoles);

    setSelectedGroupId(-1);
    setSelectedRoleId(-1);
  };

  const onRowClick = (table) => {
    setSelectedGroupId(table.row.groupId == null ? 0 : table.row.groupId);
    setSelectedRoleId(table.row.roleId == null ? 0 : table.row.roleId);
  };

  return (
    <TextEditorBlock>
      <ContentTitle>Node Group Role Editor</ContentTitle>
      <ContentParagraph>
        Assign a group and role to a node to control it&apos;s visibility to specific
        users with same group and role.
      </ContentParagraph>
      <Box sx={{ mr: '20px' }}>
        <Collapse in={openAlert}>
          <Alert
            severity={alertSeverity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alertMessage}
          </Alert>
        </Collapse>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          className={classes.root}
        >
          <Grid item xs>
            <OutlinedIdNameSelect
              label="Groups"
              name="groups"
              labelWidth={80}
              value={selectedGroupId}
              values={groups}
              onChange={onSelectedGroup}
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <OutlinedIdNameSelect
              label="Roles"
              name="roles"
              labelWidth={80}
              value={selectedRoleId}
              values={roles}
              onChange={onSelectedRole}
              fullWidth
            />
          </Grid>
          {selectedGroupId >= 0 && selectedRoleId >= 0 && (
            <Grid item xs={2}>
              <>
                <Tooltip title="Add" placement="top">
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={onAddClicked}
                  >
                    Add
                  </Button>
                </Tooltip>
                &nbsp;
                <Tooltip title="Delete" placement="top">
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={onDeleteClicked}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box sx={{ height: 300 }}>
              <DataGrid
                rows={node.groupRoles}
                columns={columns}
                autoPageSize
                fullWidth
                autoHeight
                onRowClick={onRowClick}
              />
              {isChanged && (
                <Tooltip title="Delete" placement="top">
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={onRevertClicked}
                  >
                    Revert
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </TextEditorBlock>
  );
}