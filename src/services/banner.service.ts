import { PageRequest } from './dto/page.request.ts'
import { BannerDto } from './dto/banner.dto.ts'
import { PageResponse } from './dto/page.response.ts'

class BannerService {
    private readonly BANNER_KEY = 'banners'

    async createBanner(banner: BannerDto) {
        const banners = this.listBanners();

        if (!banners.find(b => b.id === banner.id)) {
            const updatedBanners = [banner, ...banners];
            this.saveBanners(updatedBanners);
            return updatedBanners; // Return updated list
        }
        return banners; // Return the same list if no changes
    }

    async getBanners(page: PageRequest) {
        if (!page.page) page.page = 0
        if (!page.pageSize) page.pageSize = 12
        let banners = this.listBanners()
        const total = banners.length
        banners = banners.slice(page.page * page.pageSize, (page.page + 1) * page.pageSize)
        if (page.orderBy) {
            banners = banners.sort((a, b) => {
                const valueA = (Object.entries(a).find(value => value[0] === page.orderBy) || [])[1]
                const valueB = (Object.entries(b).find(value => value[0] === page.orderBy) || [])[1]
                if (valueA < valueB) return -1
                if (valueA > valueB) return 1
                return 0
            })
            if (page.orderType === 'desc') {
                banners = banners.reverse()
            }
        }

        return {
            content: banners,
            pageSize: page.pageSize,
            pageNumber: page.page,
            maxPageNumber: total / page.pageSize,
        } as PageResponse<BannerDto>
    }

    async getBanner(id: string) {
        return this.listBanners().find(banner => banner.id === id)
    }

    async updateBanner(id: string, updatedBanner: BannerDto) {
        //todo update banner logic
        let banners = this.listBanners(); // Get the list of banners

        banners = banners.map(banner => 
            banner.id === id ? { ...banner, ...updatedBanner } : banner
        );
    
        this.saveBanners(banners); // Save the updated list
        return updatedBanner;
    }

    async deleteBanner(id: string) {
        //todo delete banner logic
        let banners = this.listBanners().filter(banner => banner.id !== id)
        this.saveBanners(banners)
        return banners
    }

    private listBanners() {
        return JSON.parse(localStorage.getItem(this.BANNER_KEY) || '[]') as BannerDto[]
    }

    private saveBanners(banners: BannerDto[]) {
        localStorage.setItem(this.BANNER_KEY, JSON.stringify(banners))
    }
}

export default new BannerService()
