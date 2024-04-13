import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Row, Col } from "react-bootstrap"
import useSWR from "swr"
import ArtworkCard from "@/components/ArtworkCard"
import { Pagination } from "react-bootstrap"
import validObjectIDList from '@/public/data/validObjectIDList.json';


const PER_PAGE = 12

const fetcher = async url => {
    const res = await fetch(url)
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.')
      error.status = res.status
      throw error
    }
    return res.json()
  } 

export default function Artwork(objectIDs){

    const router = useRouter()
    const [artworkList, setArtworkList] = useState(null)
    const [page, setPage] = useState(1)
    
    let finalQuery = router.asPath.split('?')[1];
    const {data, error} = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`, fetcher)
    
    function previousPage(){
        if (page > 1){
            setPage(page - 1)
        }
    }

    function nextPage(){
        if (page < artworkList.length){
            setPage(page + 1)
        }
    }

    useEffect(()=>{
        if(data){
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
            const results = []

            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
                }
            setArtworkList(results);
            setPage(1)
        }
    },[data])

    if (error) return <Error statusCode={404} />
    if (!artworkList) return null;

    return(<>
        <Row className="gy-4">
            {artworkList.length > 0 ? (
                artworkList[page - 1].map((currentObjectID)=>(
                    <Col lg={3} key={currentObjectID}>
                        <ArtworkCard objectID={currentObjectID} />
                    </Col>
                ))
            ): (
            <Col>
                <Card>
                    <Card.Body>
                        <h4>Nothing Here</h4>
                        <p>Try searching for something else.</p>
                    </Card.Body>
                </Card>
            </Col>
            )}
        </Row>
        {artworkList.length > 0 && (
        <Row className="justify-content-center mt-4">
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage} />
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} />
            </Pagination>
          </Col>
        </Row>
      )}
    </>)
 }