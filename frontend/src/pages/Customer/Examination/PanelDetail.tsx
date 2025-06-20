import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import TitleBar from '../../../components/feature/TitleBar/TitleBar';
import ActionButton from '../../../components/common/Button/ActionButton';
import api from '../../../api/axios';

const PanelDetail: React.FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [panel, setPanel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        api.get(`/panels/${id}`)
            .then(res => {
                setPanel(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Panel not found.');
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error || !panel) return <div className="p-8 text-center">{error || 'Panel not found.'}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <TitleBar
                    text={panel.panelName}
                    buttonLabel={<><span style={{fontSize: '1.2em'}}>&larr;</span> Back</>}
                    onButtonClick={() => navigate(-1)}
                />
                <div className="bg-white rounded-xl shadow-md p-6 mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <div
                            className="text-pink-500 font-bold text-2xl">{panel.price ? `${panel.price} USD` : ''}</div>
                        <div className="text-gray-400 text-xs">Results in {panel.responseTime} hours</div>
                    </div>
                    <div className="mb-4">
                        <div className="font-semibold mb-1">Tests included:</div>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            {panel.testTypesNames && panel.testTypesNames.map((name: string, idx: number) => (
                                <li key={name}>
                                    <b>{name}:</b> {panel.testTypesDescriptions && panel.testTypesDescriptions[idx]}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-2 text-gray-600">{panel.description}</div>
                    <div className="mb-2 text-gray-600">Type: {panel.panelType}</div>
                    <div className="mb-2 text-gray-600">Tag: {panel.panelTag}</div>
                    <div className="flex gap-4 mt-6">
                        <ActionButton
                            variant="primary"
                            actionType="book"
                            onClick={async () => {
                                try {
                                    const today = new Date();
                                    const date = today.toISOString().split('T')[0];
                                    const slot = 'ONE';
                                    await api.post('/examinations', {
                                        aPanel: panel,
                                        date,
                                        slot
                                    });
                                    alert('Booking successful!');
                                } catch (err) {
                                    alert('Booking failed!');
                                }
                            }}
                        >
                            Book
                        </ActionButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PanelDetail;
