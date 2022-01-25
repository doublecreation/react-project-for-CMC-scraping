import { keyframes } from "styled-components";
import { isExportSpecifier } from "typescript";

const columns = [
  {
    name: "Rank",
    selector: row => row.rank,
    sortable: true,
  },
  {
    name: "Name",
    selector: row => row.id,
  },
  {
    name: "price",
    selector: row => row.price,
    sortable: true,
  },
  {
    name: "24h(%)",
    selector: row => row["1d"].volume_change_pct,
    sortable: true,
  },
  {
    name: "Volume(24h)",
    selector: row => row["1d"].volume,
    sortable: true,
  },

];

const darkTheme = {
  title: {
    fontSize: '22px',
    fontColor: '#FFFFFF',
    backgroundColor: '#363640',
  },
  contextMenu: {
    backgroundColor: '#E91E63',
    fontColor: '#FFFFFF',
  },
  header: {
    fontSize: '12px',
    fontColor: '#FFFFFF',
    backgroundColor: '#363640',
  },
  rows: {
    fontColor: '#FFFFFF',
    backgroundColor: '#363640',
    borderColor: 'rgba(255, 255, 255, .12)',
    hoverFontColor: 'black',
    hoverBackgroundColor: 'rgba(0, 0, 0, .24)',
  },
  cells: {
    cellPadding: '10px',
  },
};

const customStyles = {
  headCells: {
    style: {
      background: '#5577',
      fontSize: '16px',
      fontStyle: 'italic',
      color: '#6f6'
    },
  },
  cells: {
    style: {
      color: '#00ccff',
      fontWeight: 'bold',
      background: '#232323',
    },
  },
  pagination: {
    style: {
      color: 'white'
    }
  },
};

export { columns, darkTheme, customStyles }