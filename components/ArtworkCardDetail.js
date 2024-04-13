import useSWR from "swr"
import Card from 'react-bootstrap/Card';
import Error from "next/error";
import { useAtom } from "jotai";
import { favouritesAtom } from '../store';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import { addToFavourites, removeFromFavourites } from '@/lib/userData';

const fetcher = async url => {
    const res = await fetch(url)
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.')
      error.status = res.status
      throw error
    }
    return res.json()
  } 

export default function ArtworkCardDetail({objectID}){
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const {data, error} = useSWR(objectID  ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`: null, fetcher)
    const [showAdded, setShowAdded] = useState(false);

    useEffect(() => {
        setShowAdded(favouritesList?.includes(objectID));
    }, [favouritesList, objectID]);

    async function favouritesClicked() {

        if (showAdded) {
          setFavouritesList(await removeFromFavourites(objectID));
          setShowAdded(false);
        } else {
          setFavouritesList(await addToFavourites(objectID));
          setShowAdded(true);
        }
    }

      
    if (error) return <Error statusCode={404} />
    if (!data) return null;
    
    const {primaryImage, title, objectDate, classification, medium, artistDisplayName, creditLine, dimensions, artistWikidata_URL} = data;

    return(<>
        <Card style={{ width: '80rem' }}>
            {primaryImage && <Card.Img variant="top" src={primaryImage} />}
            <Card.Body>
                <Card.Title>{title || 'N/A'}</Card.Title>
                <Card.Text>
                    Object Date: {objectDate || 'N/A'} <br/>
                    Classification: {classification || 'N/A'} <br/>
                    Medium: {medium || 'N/A'} <br/><br/>
                    {artistDisplayName && (
                    <>
                        Artist: {artistDisplayName || 'N/A'} <a href={artistWikidata_URL} target="_blank" rel="noreferrer">(wiki)</a><br />
                    </>)}
                    Credit Line: {creditLine || 'N/A'}<br />
                    Dimensions: {dimensions || 'N/A'}<br />
                </Card.Text>
                <Button variant={showAdded ? "primary" : "outline-primary"} onClick={favouritesClicked}>
                        + Favourite {showAdded && "(added)"}
                </Button>
            </Card.Body>
        </Card>
    </>)
}