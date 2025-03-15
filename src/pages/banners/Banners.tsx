import { useEffect, useState } from "react";
import { usePageData } from "../../context/page-data/page-data.context.ts";
import BannerCard from "../../components/banner/BannerCard.tsx";
import ScrollableCards from "../../components/ScrollableCards.tsx";
import { BannerDto } from "../../services/dto/banner.dto.ts";
import { PageRequest } from "../../services/dto/page.request.ts";
import type { PageResponse } from "../../services/dto/page.response.ts";
import BannerService from "../../services/banner.service.ts";
import FAB from "../../components/FAB.tsx";

export default function Banners() {
    const { setPageData } = usePageData();
    const [banners, setBanners] = useState<BannerDto[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        setPageData({ title: "Banners" });
        fetchBanners({ page: 0, pageSize: 10 }, true);
    }, [setPageData]);

    
    const fetchBanners = async (pageRequest: PageRequest, replace = false): Promise<PageResponse<BannerDto> | undefined> => {
        try {
            const pageData = await BannerService.getBanners(pageRequest);
            if (pageData) {
                setHasMore(pageData.pageNumber + 1 < Math.ceil(pageData.maxPageNumber));
                setBanners((prev) => (replace ? pageData.content : [...prev, ...pageData.content]));
                
                return pageData; 
            }
        } catch (error) {
            console.error("Error fetching banners:", error);
        }
        return undefined; 
    };

    const updateBanner = (updatedBanner: BannerDto) => {
        setBanners((prev) => {
            const newBanners = prev.map((banner) =>
                banner.id === updatedBanner.id ? { ...updatedBanner } : banner
            );
    
            console.log("Previous banners:", prev);
            console.log("Updated banners:", newBanners);
            return newBanners;
        });
    };


    return (
        <>
            <ScrollableCards
                loadMore={(page) => fetchBanners(page)}
                hasMore={hasMore}
                mapCard={(banner, deleteItem) => (
                    <BannerCard
                        key={banner.id}
                        banner={banner}
                        delete={async () => {
                            deleteItem(banner.id!);
                            await BannerService.deleteBanner(banner.id!).catch((reason) =>
                                console.error("Error deleting banner:", reason)
                            );
                        }}
                        update={updateBanner} 
                    />
                )}
                skeletonMap={(_, i) => <BannerCard key={"skeleton-" + i} />}
            />

            <FAB />
        </>
    );
}
