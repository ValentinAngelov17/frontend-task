import { Grid } from '@mui/joy'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useCallback, useEffect, useState } from 'react'
import { PageRequest } from '../services/dto/page.request.ts'
import { PageResponse } from '../services/dto/page.response.ts'

export default function ScrollableCards<T extends { id: string }>(props: {
    loadMore: (page: PageRequest) => Promise<PageResponse<T> | undefined>;
    mapCard: (value: T, deleteItem: (id: string) => void) => React.JSX.Element;
    skeletonMap: (_: any, index: number) => React.JSX.Element;
    hasMore: boolean;
}) {
    const initial = [...Array(0)].map(props.skeletonMap)
    const [cards, setCards] = useState<React.JSX.Element[]>(initial)
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)

    const deleteItem = useCallback((id: string) => {
        setCards((prevCardsState) => {
            const i = prevCardsState.findIndex((card) => card.key == id)
            if (i != -1) {
                const newCards = [...prevCardsState]
                newCards.splice(i, 1)
                return newCards
            }
            return prevCardsState
        })
    }, [])

    const [cardsData, setCardsData] = useState<T[]>([]); 

    const loadBanners = useCallback(async () => {
        try {
            const newCards = await props.loadMore({ page, pageSize: 12 });
            if (!newCards || !newCards.content) return;

            if (newCards.content.length > 0) {
                setPage((prevPage) => prevPage + 1);
            }

            setCardsData((prevCards) => {
                const existingIds = new Set(prevCards.map((item) => item.id));

                const newElements = newCards.content.filter((value) => !existingIds.has(value.id));
                return [...prevCards, ...newElements]; 
            });

            setHasMore(newCards.pageNumber + 1 < Math.ceil(newCards.maxPageNumber));
        } catch (error) {
            console.error("Error loading banners:", error);
        }
    }, [page, props]);




    useEffect(() => {
        loadMore()
    }, [cards])

    const loadMore = () => {
        loadBanners().catch((reason) => console.error(reason))
    }

    return (
        <Grid
            container
            spacing={2}
            sx={{

                '@media (max-width: 900px)': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            }}
        >
            <InfiniteScroll
                dataLength={cardsData.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
            >
                {cardsData.map((item) => props.mapCard(item, deleteItem))} 
            </InfiniteScroll>
        </Grid>
    )
}
