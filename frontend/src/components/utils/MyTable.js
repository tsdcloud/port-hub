import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';


const ro = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const col = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];

export default function MyTable({columns, rows, listmenu=[], action=false, message="Aucune donnée!"}) {
  const [selectedRow, setSelectedRow] = React.useState();
  const [contextMenu, setContextMenu] = React.useState(null);

  const handleContextMenu = (event) => {
    var id = event.currentTarget.getAttribute('data-id')
    var row = rows.filter(item=>{
      if(item.id==id){return true}else{return false}
    })
    event.preventDefault();
    setSelectedRow(row[0]);
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };
  
  return (
    (rows.length == 0) ? <div>{message}</div> :
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid 
        rows={rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        onRowClick={(event)=>{
          console.log(event)
        }}
        slotProps={{
          row: {
            onContextMenu: handleContextMenu,
            style: { cursor: 'context-menu' },
          },
        }}
      />
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        slotProps={{
          root: {
            onContextMenu: (e) => {
              e.preventDefault();
              handleClose();
            },
          },
        }}
      >
        {listmenu.map((item) => {
            const key = item.id
            return (
                <MenuItem key={key} onClick={()=>{handleClose();item.callback(selectedRow)}}>
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    {item.label}
                </MenuItem>
            );
        })}
      </Menu>
    </div>
  );
}
