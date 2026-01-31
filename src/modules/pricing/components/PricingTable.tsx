import * as React from "react";
import { NoData } from "@/components/feedback/NoData";
import TableWrapper from "@/components/table/TableWrapper";
import {
    MuiBox,
    MuiIconButton,
    MuiTable,
    MuiTableBody,
    MuiTableCell,
    MuiTableContainer,
    MuiTableHead,
    MuiTableRow,
    MuiTypography,
    MuiMenu,
    MuiMenuItem,
    styled,
    MuiButton,
} from "@/lib/index";
import { IconVisibility, IconAttachment, IconPlus, IconDownload, IconDelete, IconAdd } from "@/lib/mui.lib.icons";
import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";
import {
    formatCurrency,
    formatDate,
    usePageNavigationParam,
} from "utils/helper-funcs";
import {
    IPagination,
} from "@/types/globalTypes";
import PrimaryButton from "@/components/button/Button";
import { toast } from "react-toastify";
import AppCustomModal from "@/components/modal/Modal";
import { PricingModelUploadForm } from "./PricingModelUploadForm";

const INITIAL_DATA = [
    {
        id: "1",
        name: "January.csv",
        price: 5000,
        reference: "PRC-JAN",
        date: "2024-01-15T10:00:00Z",
        status: "synced",
        transactions: 120
    },
    {
        id: "2",
        name: "February.csv",
        price: 15000,
        reference: "PRC-FEB",
        date: "2024-02-15T11:00:00Z",
        status: "processing",
        transactions: 50
    },
    {
        id: "3",
        name: "March.csv",
        price: 50000,
        reference: "PRC-MAR",
        date: "2024-03-15T09:30:00Z",
        status: "synced",
        transactions: 210
    },
    {
        id: "4",
        name: "April.csv",
        price: 45000,
        reference: "PRC-APR",
        date: "2024-04-15T14:20:00Z",
        status: "synced",
        transactions: 180
    },
    {
        id: "5",
        name: "May.csv",
        price: 35000,
        reference: "PRC-MAY",
        date: "2024-05-15T16:00:00Z",
        status: "synced",
        transactions: 150
    },
    {
        id: "6",
        name: "June.csv",
        price: 60000,
        reference: "PRC-JUN",
        date: "2024-06-15T10:45:00Z",
        status: "processing",
        transactions: 90
    },
    {
        id: "7",
        name: "July.csv",
        price: 55000,
        reference: "PRC-JUL",
        date: "2024-07-15T11:30:00Z",
        status: "synced",
        transactions: 220
    },
    {
        id: "8",
        name: "August.csv",
        price: 40000,
        reference: "PRC-AUG",
        date: "2024-08-15T13:15:00Z",
        status: "synced",
        transactions: 130
    },
    {
        id: "9",
        name: "September.csv",
        price: 48000,
        reference: "PRC-SEP",
        date: "2024-09-15T09:00:00Z",
        status: "processing",
        transactions: 75
    },
    {
        id: "10",
        name: "October.csv",
        price: 52000,
        reference: "PRC-OCT",
        date: "2024-10-15T15:45:00Z",
        status: "synced",
        transactions: 195
    },
    {
        id: "11",
        name: "November.csv",
        price: 58000,
        reference: "PRC-NOV",
        date: "2024-11-15T12:30:00Z",
        status: "synced",
        transactions: 205
    },
    {
        id: "12",
        name: "December.csv",
        price: 65000,
        reference: "PRC-DEC",
        date: "2024-12-15T14:00:00Z",
        status: "synced",
        transactions: 250
    },
    {
        id: "13",
        name: "Q1_Summary.csv",
        price: 35000,
        reference: "PRC-Q1",
        date: "2024-03-31T10:00:00Z",
        status: "synced",
        transactions: 145
    },
    {
        id: "14",
        name: "Q2_Summary.csv",
        price: 42000,
        reference: "PRC-Q2",
        date: "2024-06-30T11:00:00Z",
        status: "processing",
        transactions: 160
    },
    {
        id: "15",
        name: "Q3_Summary.csv",
        price: 48000,
        reference: "PRC-Q3",
        date: "2024-09-30T09:30:00Z",
        status: "synced",
        transactions: 185
    }
];

const defaultQuery: IPagination = {
    pageSize: 5,
    page: 1,
    total: INITIAL_DATA.length,
    hasNextPage: true,
    hasPrevPage: false,
    totalPages: Math.ceil(INITIAL_DATA.length / 5),
};

export function PricingTable() {
    const { page } = usePageNavigationParam();
    const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);
    const [isLoading, setIsLoading] = React.useState(false);
    const [allData, setAllData] = React.useState(INITIAL_DATA);
    const [data, setData] = React.useState(INITIAL_DATA.slice(0, 5));
    // const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedRow, setSelectedRow] = React.useState<any>(null);
    const [showModal, setShowModal] = React.useState(false);

    React.useEffect(() => {
        const currentPage = page || 1;

        const total = allData.length;
        const totalPages = Math.ceil(total / defaultQuery.pageSize);

        setPagination(prev => ({
            ...prev,
            page: currentPage,
            total,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1
        }));

        const start = (currentPage - 1) * defaultQuery.pageSize;
        const end = start + defaultQuery.pageSize;
        setData(allData.slice(start, end));

    }, [page, allData]);

    const handleChange = (page: number) => {
        // Handled by TableWrapper and hook URL params
    };

    const handleToggleModal = () => {
        setShowModal(prev => !prev);
    };

    const handleUploadSuccess = (file: File) => {
        setIsLoading(true);
        setTimeout(() => {
            const newItem = {
                id: `${allData.length + 1}`,
                name: file.name,
                price: 0,
                reference: `PRC-NEW-${allData.length + 1}`,
                date: new Date().toISOString(),
                status: "processing",
                transactions: 0
            };
            const newData = [newItem, ...allData];
            setAllData(newData);
            setIsLoading(false);
            toast.success("File uploaded successfully");
        }, 1000);
    };

    const handleActionClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleActionClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const handleDownload = async () => {
        if (selectedRow) {
            toast.info(`Downloading ${selectedRow.name}...`);
            try {
                const path = `/assets/pricing-models/${selectedRow.name}`;
                const res = await fetch(path);
                if (!res.ok) {
                    toast.error('File not found');
                } else {
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = selectedRow.name;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                    toast.success('Download started');
                }
            } catch (err) {
                toast.error('Download failed');
            }
        }
        handleActionClose();
    };

    const handleDelete = () => {
        if (selectedRow) {
            if (window.confirm("Are you sure you want to delete this pricing model?")) {
                setAllData(prev => prev.filter(item => item.id !== selectedRow.id));
                toast.success("Pricing model deleted successfully");
            }
        }
        handleActionClose();
    };

    return (
        <StyledPage>
            <div className="tab-section">
                <div className="top-section">
                    <MuiTypography variant="body2" className="heading">
                        Pricing Models
                    </MuiTypography>
                    <MuiButton
                        startIcon={<IconAdd />}
                        variant="contained"
                        color="primary"
                        onClick={handleToggleModal}
                        className="btn"
                        sx={{
                            backgroundColor: '#F05B2A', // Keep the orange color as per design but use MuiButton structure
                            '&:hover': {
                                backgroundColor: '#d64d20'
                            }
                        }}
                    >
                        Upload New
                    </MuiButton>
                </div>
            </div>

            <TableWrapper
                showPagination
                handleChangePagination={handleChange}
                pagination={pagination}>
                <MuiTableContainer
                    sx={{
                        maxWidth: "100%",
                        minHeight: "unset",
                        flex: 1,
                    }}>
                    <MuiTable
                        sx={{
                            minWidth: 750,
                        }}
                        aria-label="simple table">
                        <MuiTableHead>
                            <MuiTableRow>
                                <MuiTableCell className="heading">File Name</MuiTableCell>
                                <MuiTableCell className="heading">Reference</MuiTableCell>
                                <MuiTableCell className="heading">Price</MuiTableCell>
                                <MuiTableCell className="heading">Transactions Count</MuiTableCell>
                                <MuiTableCell className="heading">Date Created</MuiTableCell>
                                <MuiTableCell className="heading">Status</MuiTableCell>
                                <MuiTableCell className="heading">Actions</MuiTableCell>
                            </MuiTableRow>
                        </MuiTableHead>

                        <MuiTableBody>
                            {data.map((row) => (
                                <MuiTableRow
                                    key={row.id}
                                    sx={{
                                        "&:last-child td, &:last-child th": { border: 0 },
                                    }}>
                                    <MuiTableCell>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <IconAttachment style={{ width: '16px', height: '16px', color: '#666' }} />
                                            {row.name}
                                        </div>
                                    </MuiTableCell>
                                    <MuiTableCell>
                                        {row.reference}
                                    </MuiTableCell>
                                    <MuiTableCell>
                                        ₦{formatCurrency({
                                            amount: row.price,
                                            style: "decimal",
                                        })}
                                    </MuiTableCell>
                                    <MuiTableCell>
                                        {row.transactions}
                                    </MuiTableCell>
                                    <MuiTableCell>
                                        {formatDate(row.date)}
                                    </MuiTableCell>
                                    <MuiTableCell>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: row.status === 'synced' ? '#e8fff3' : '#fff4e5',
                                            color: row.status === 'synced' ? '#45b26b' : '#ff9800',
                                            textTransform: 'capitalize'
                                        }}>
                                            {row.status}
                                        </span>
                                    </MuiTableCell>
                                    <MuiTableCell>
                                        <MuiBox className="action-group">
                                            <MuiIconButton
                                                className="visible-btn"
                                                onClick={(e) => handleActionClick(e, row)}
                                            >
                                                <IconVisibility />
                                            </MuiIconButton>
                                        </MuiBox>
                                    </MuiTableCell>
                                </MuiTableRow>
                            ))}

                            {!isLoading && data.length === 0 && (
                                <MuiTableRow>
                                    <MuiTableCell
                                        colSpan={7}
                                        className="no-data-cell"
                                        align="center">
                                        <NoData title="No Pricing Models" message="" />
                                    </MuiTableCell>
                                </MuiTableRow>
                            )}

                            {isLoading && (
                                <CustomTableSkeleton columns={7} rows={5} />
                            )}
                        </MuiTableBody>
                    </MuiTable>
                </MuiTableContainer>
            </TableWrapper>

            <MuiMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleActionClose}
                PaperProps={{
                    style: {
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                        borderRadius: '8px',
                        minWidth: '150px'
                    },
                }}
            >
                <MuiMenuItem onClick={handleDownload} sx={{ fontSize: '13px', gap: '10px' }}>
                    <IconDownload style={{ width: '18px', height: '18px', color: '#1e75bb' }} />
                    Download
                </MuiMenuItem>
                <MuiMenuItem onClick={handleDelete} sx={{ fontSize: '13px', gap: '10px', color: '#d32f2f' }}>
                    <IconDelete style={{ width: '18px', height: '18px', color: '#d32f2f' }} />
                    Delete
                </MuiMenuItem>
            </MuiMenu>

            <AppCustomModal
                handleClose={handleToggleModal}
                open={showModal}
                alignTitle="left"
                closeOnOutsideClick={false}
                title="Upload Pricing Model"
                showClose>
                <PricingModelUploadForm
                    handleClose={handleToggleModal}
                    onUploadSuccess={handleUploadSuccess}
                />
            </AppCustomModal>
        </StyledPage>
    );
}

const StyledPage = styled.section`
  width: 100%;

  & .action-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  & .visible-btn {
    background-color: #e8f1f8;
    border-radius: 10px;
    color: #1e75bb;
    padding: 12px;

    svg {
      width: 15px;
      height: 15px;
    }
  }

  & .top-section {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;

    & .heading {
      font-weight: 600;
      color: #000;
      font-size: 18px;
      font-family: "Helvetica";
    }
  }

  & .tab-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 30px 0 15px 0;
    flex-wrap: wrap;
    gap: 20px;
  }

  & .btn {
    height: 36px;
    font-size: 12px;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
`;