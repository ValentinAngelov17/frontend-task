import { BannerDto } from "../../services/dto/banner.dto.ts";
import { Button, Card, CardActions, CardOverflow, Grid, Skeleton, Typography, Input } from "@mui/joy";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import { Delete } from "@mui/icons-material";
import Image from "../Image.tsx";
import BannerService from "../../services/banner.service.ts";
import ConfirmModal from "../ConfirmModal.tsx";
import { useState } from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { DialogActions, DialogContent, DialogTitle } from "@mui/joy";

export default function BannerCard(props: {
    banner?: BannerDto;
    delete?: (id: string) => void;
    update?: (updatedBanner: BannerDto) => void;
}) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [updatedBanner, setUpdatedBanner] = useState<BannerDto | null>(props.banner || null);

    const banner = props.banner || { id: "", link: "", imageUrl: "" };

    const handleDeleteClick = (id: string) => {
        setSelectedId(id);
        setOpenModal(true);

    };

    const confirmDelete = async () => {
        if (selectedId) {
            await BannerService.deleteBanner(selectedId);
            props.delete?.(selectedId);
        }
        setOpenModal(false);
    };

    const handleEditClick = () => {
        setUpdatedBanner(banner);
        setOpenEditModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (updatedBanner) {
            setUpdatedBanner({ ...updatedBanner, [e.target.name]: e.target.value });
        }
    };

    const handleSaveChanges = async () => {
        if (banner && updatedBanner) {
            await BannerService.updateBanner(banner.id, updatedBanner);
            
            props.update?.(updatedBanner);
            setTimeout(() => window.location.reload(), 200); 
        }
    };

    return (
        <Grid xl={3} lg={4} md={6} sm={6} xs={12}>
            <Card sx={{ height: 300, width: 300 }}>
                <CardOverflow>
                    <Image url={banner.imageUrl} />
                </CardOverflow>
                <Box>
                    <Typography
                        level="title-lg"
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            width: "100%",
                        }}
                    >
                        <Skeleton loading={!props.banner} variant="text" sx={{ width: "100%", height: "100%" }}>
                            {banner.link}
                        </Skeleton>
                    </Typography>
                </Box>
                <CardActions>
                    <IconButton variant="outlined" size="sm" onClick={() => handleDeleteClick(banner.id)}>
                        <Delete />
                    </IconButton>

                    <Button variant="solid" size="md" onClick={handleEditClick} color="primary" sx={{ width: "75%", fontWeight: 600 }}>
                        Edit
                    </Button>
                </CardActions>
            </Card>

            <ConfirmModal open={openModal} onClose={() => setOpenModal(false)} confirm={confirmDelete} action="delete this banner" />

            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <ModalDialog>
                    <DialogTitle>Edit Banner</DialogTitle>
                    <DialogContent>
                        <Input
                            type="text"
                            name="link"
                            value={updatedBanner?.link || ""}
                            onChange={handleInputChange}
                            placeholder="Enter banner link"
                        />
                        <Input
                            type="text"
                            name="imageUrl"
                            value={updatedBanner?.imageUrl || ""}
                            onChange={handleInputChange}
                            placeholder="Enter image URL"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" onClick={handleSaveChanges}>
                            Save
                        </Button>
                        <Button variant="plain" onClick={() => setOpenEditModal(false)}>
                            Cancel
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </Grid>
    );
}



