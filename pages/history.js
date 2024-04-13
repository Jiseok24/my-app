import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { useRouter } from 'next/router';
import { Card, ListGroup, Button } from 'react-bootstrap';
import styles from '@/styles/History.module.css';
import { removeFromHistory } from '@/lib/userData';

export default function History() {
    const router = useRouter();
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    if (!searchHistory) return null;

    const parsedHistory = searchHistory.map(searchQuery => {
        const params = new URLSearchParams(searchQuery);
        const entries = params.entries();
        return Object.fromEntries(entries);
    });

    const historyClicked = (e, index) => {
        e.preventDefault();
        const query = searchHistory[index];
        router.push(`/artwork?${query}`);
    };

    const removeHistoryClicked = async (e, index) => {
        e.stopPropagation();
        const updatedHistory = [...searchHistory];
        updatedHistory.splice(index, 1);
        setSearchHistory(await removeFromHistory(searchHistory[index]));
    };

    return (
        <div>
            {parsedHistory.length === 0 ? (
                <Card>
                <Card.Body>
                <>
                <h4>Nothing Here</h4>
                <p>Try searching for some artwork.</p>
                </>
                </Card.Body>
                </Card>
            ) : (
                <ListGroup>
                    {parsedHistory.map((historyItem, index) => (
                        <ListGroup.Item
                            key={index}
                            onClick={e => historyClicked(e, index)}
                            className={styles.historyListItem}
                        >
                            {Object.keys(historyItem).map(key => (
                                <span key={key}>
                                    {key}: <strong>{historyItem[key]}</strong>&nbsp;
                                </span>
                            ))}
                            <Button
                                className="float-end"
                                variant="danger"
                                size="sm"
                                onClick={e => removeHistoryClicked(e, index)}
                            >
                                &times;
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
}
