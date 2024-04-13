import { useRouter } from "next/router"
import { Col, Row } from "react-bootstrap";
import ArtworkCardDetail from "@/components/ArtworkCardDetail";

export default function ArtworkByID(){
    const router = useRouter()
    const { objectID } = router.query;

    return(<>
    <Row>
        <Col>
            <ArtworkCardDetail objectID={objectID} />
        </Col>
    </Row>
    </>)
}