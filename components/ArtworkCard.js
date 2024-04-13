import useSWR from "swr"
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from "next/link";
import Error from "next/error";

const fetcher = async url => {
    const res = await fetch(url)
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.')
      error.status = res.status
      throw error
    }
    return res.json()
  } 

export default function ArtworkCard({objectID}){
    const {data, error} = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`, fetcher)
    
    if (error) return <Error statusCode={404} />
    if (!data) return null;

    const {primaryImageSmall, title, objectDate, classification, medium} = data;
    const imageUrl = primaryImageSmall || 'https://via.placeholder.com/375x375.png?text=[+Not+Available+]';
    return(<>
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={imageUrl} />
            <Card.Body>
                <Card.Title>{title || 'N/A'}</Card.Title>
                <Card.Text>
                    Object Date: {objectDate || 'N/A'} <br/>
                    Classification: {classification || 'N/A'} <br/>
                    Medium: {medium || 'N/A'} <br/>
                    <Link href={`/artwork/${objectID}`} passHref>
                        <Button variant="outline-dark">ID: {objectID}</Button>
                    </Link>
                </Card.Text>
            </Card.Body>
        </Card>
    </>)
}