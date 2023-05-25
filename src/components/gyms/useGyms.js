import { useState, useEffect } from 'react';
import { db } from '../../FirebaseSetup';

const PAGE_SIZE = 10;

export const useGyms = (filters, triggerFetchMore) => {
    const [gyms, setGyms] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async (startAfter) => {
        let query = db.collection('gyms').orderBy('name');

        if (filters.country) {
            query = query.where('country', '==', filters.country);
        }

        if (filters.state) {
            query = query.where('state', '==', filters.state);
        }

        query = query.limit(PAGE_SIZE);

        if (startAfter) {
            query = query.startAfter(startAfter);
        }

        console.log('Filters:', filters);

        const snapshot = await query.get();

        const lastVisibleSnapshot = snapshot.docs[snapshot.docs.length - 1];
        setLastVisible(lastVisibleSnapshot);

        const fetchedGyms = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // console.log('Fetched gyms:', fetchedGyms);

        if (triggerFetchMore) {
            setGyms((prevGyms) => [...prevGyms, ...fetchedGyms]);
        } else {
            setGyms(fetchedGyms);
        }

        setLoading(false);
        setHasMore(fetchedGyms.length > 0);
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [filters]);

    useEffect(() => {
        if (triggerFetchMore && hasMore) {
            fetchData(lastVisible);
        }
    }, [triggerFetchMore]);

    return { gyms, loading, setLoading, hasMore };
};
