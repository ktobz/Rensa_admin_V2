import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    MuiButton,
    MuiCircularProgress,
    styled,
    MuiTypography,
    MuiBox,
    MuiIconButton,
} from "@/lib/index";
import { toast } from "react-toastify";
import { IconAttachment, IconDownload } from "@/lib/mui.lib.icons";
import MarketDataService from "@/services/market-data.service";

interface PricingModelUploadFormProps {
    handleClose: () => void;
    onUploadSuccess: (file: File) => void;
}

const SCHEMA = Yup.object().shape({
    file: Yup.mixed()
        .test("fileType", "Only CSV files are allowed", (value) => {
            if (!value) return false;
            return (value && value.type === "text/csv") || (value && value.name?.toLowerCase().endsWith(".csv"));
        })
        .required("A CSV file is required"),
    mode: Yup.string().oneOf(["Clean", "Append"]).required("Mode is required"),
});

export const PricingModelUploadForm = ({ handleClose, onUploadSuccess }: PricingModelUploadFormProps) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = React.useState<string | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    const formik = useFormik({
        initialValues: {
            file: null as File | null,
            mode: "Clean",
        },
        validationSchema: SCHEMA,
        onSubmit: async (values: { file: File | null; mode: string }) => {
            if (values.file) {
                try {
                    setIsUploading(true);
                    for (let i = 0; i <= 60; i += 10) {
                        // eslint-disable-next-line no-await-in-loop
                        await new Promise((r) => setTimeout(r, 60));
                        setProgress(i);
                    }

                    await MarketDataService.uploadAsync(values.file, values.mode);

                    for (let i = 70; i <= 100; i += 10) {
                        // eslint-disable-next-line no-await-in-loop
                        await new Promise((r) => setTimeout(r, 40));
                        setProgress(i);
                    }

                    onUploadSuccess(values.file);
                    toast.success("File uploaded successfully");
                    handleClose();
                } catch (err: any) {
                    toast.error(err?.response?.data?.message || "Upload failed");
                } finally {
                    setIsUploading(false);
                }
            }
        },
    });

    const { setFieldValue, handleSubmit, errors, touched, values, setFieldTouched } = formik;

    const handleFile = (file?: File) => {
        if (!file) return;
        setFieldValue("file", file);
        setFileName(file.name);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        handleFile(file);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    return (
        <StyledForm onSubmit={handleSubmit} aria-label="pricing-upload-form">
            <div className="wrapper">
                <MuiBox className="header-row">
                    <MuiTypography variant="body1" className="title">
                        Upload Pricing CSV
                    </MuiTypography>
                    <MuiButton
                        variant="text"
                        color="inherit"
                        startIcon={<IconDownload />}
                        href="/assets/pricing-models/template.csv"
                        download
                    >
                        Download template
                    </MuiButton>
                </MuiBox>

                <div
                    className="dropzone"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    role="button"
                    tabIndex={0}
                    onClick={triggerFileInput}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        accept=".csv,text/csv"
                    />
                    <div className="dz-content">
                        <IconAttachment style={{ fontSize: 44, color: "#6b7280" }} />
                        <MuiTypography variant="body2" color="textSecondary">
                            {fileName ? fileName : "Drag & drop a CSV file here, or click to browse"}
                        </MuiTypography>
                        {errors.file && touched.file && (
                            <MuiTypography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                                {errors.file}
                            </MuiTypography>
                        )}
                    </div>
                </div>

                <div className="mode-row" style={{ padding: "12px 18px 0" }}>
                    <MuiTypography variant="body2" sx={{ mb: 1 }}>
                        Upload mode
                    </MuiTypography>
                    <select
                        value={values.mode}
                        onChange={(e) => {
                            setFieldValue("mode", e.target.value);
                            setFieldTouched("mode", true);
                        }}
                        style={{ width: "100%", padding: "8px", borderRadius: 8 }}
                        disabled={isUploading}
                    >
                        <option value="Clean">Clean (replace existing)</option>
                        <option value="Append">Append (add to existing)</option>
                    </select>
                    {errors.mode && touched.mode && (
                        <MuiTypography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                            {errors.mode}
                        </MuiTypography>
                    )}
                </div>

                <div className="btn-group">
                    <MuiButton
                        variant="contained"
                        color="inherit"
                        onClick={handleClose}
                        disabled={isUploading}
                        className="btn cancel-btn"
                    >
                        Cancel
                    </MuiButton>

                    <MuiButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isUploading || !fileName}
                        startIcon={isUploading ? <MuiCircularProgress size={16} /> : null}
                        className="btn"
                    >
                        {isUploading ? `Uploading ${progress}%` : "Upload"}
                    </MuiButton>
                </div>
            </div>
        </StyledForm>
    );
};

const StyledForm = styled.form`
    width: 100%;
    max-width: 450px;
    background-color: #fff;
    padding: 10px 0px 0px 0px;
    border-radius: 20px;

    & .wrapper {
        width: 100%;
        max-width: 450px;
    }

    & .header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 18px;
    }

    & .title {
        font-weight: 600;
        font-size: 16px;
    }

    & .dropzone {
        border: 2px dashed #e6e9ef;
        border-radius: 12px;
        padding: 28px 16px;
        background: #fafafa;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        min-height: 180px;
        transition: all 0.2s ease;
        margin: 16px 18px 0;

        &:hover {
            background-color: #f5f5f5;
            border-color: #d0d0d0;
        }
    }

    & .dz-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        text-align: center;
        color: #6b7280;
    }

    & .btn {
        width: 100%;
        margin-top: 45px;
        display: flex !important;
        align-items: center;
        justify-content: center;
    }

    & .btn-group {
        display: flex;
        gap: 20px;
        align-items: center;
        justify-content: space-between;
        padding: 0 18px;
    }
`;