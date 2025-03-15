import { Button, Input, Grid } from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import BannerService from '../../services/banner.service.ts'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import { v4 as uuidv4 } from 'uuid'



export default function BannerCreate() {
    const navigate = useNavigate()
    const { setPageData } = usePageData()

    useEffect(() => {
        setPageData({ title: 'Banners > Create New Banner' })
    }, [setPageData])

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)
        const title = formData.get('title') as string
        const imageUrl = formData.get('image') as string

        if (!isValidUrl(imageUrl)) {
            alert('Please enter a valid image URL')
            return
        }

        const bannerData = {
            id: uuidv4(),
            link: title,
            imageUrl: imageUrl,
        }

        try {
            await BannerService.createBanner(bannerData)
            navigate('/banners') // Navigate back to the banners list
        } catch (error) {
            console.error('Error creating banner:', error)
            alert('There was an error creating the banner.')
        }
    }

    // Simple URL validation (you could expand this)
    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url) // Check if the URL is a valid URL
            return true
        } catch (e) {
            return false
        }
    }

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap="12px"
            sx={{ maxWidth: 400, margin: 'auto' }}
        >
            <h2>Create a New Banner</h2>
            <form
                onSubmit={handleFormSubmit}
                style={{ width: '100%', display: "flex", flexDirection: "column", gap: "12px" }}
            >
                <Input
                    name="title"
                    placeholder="Enter Banner Title"
                    required
                    sx={{ width: '100%' }}
                />
                <Input
                    name="image"
                    placeholder="Enter Image URL"
                    required
                    sx={{ width: '100%' }}
                />
                <Button
                    type="submit"
                    variant="solid"
                    color="primary"
                    sx={{ width: '100%' }}
                >
                    Create Banner
                </Button>
            </form>
        </Grid >
    )
}
