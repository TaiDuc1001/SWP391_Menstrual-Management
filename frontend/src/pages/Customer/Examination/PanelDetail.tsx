import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import TitleBar from '../../../components/feature/TitleBar/TitleBar';
import ActionButton from '../../../components/common/Button/ActionButton';
import { TypeBadge, TagBadge } from '../../../components';
import { TYPE_BADGE_STYLES, TAG_BADGE_STYLES } from '../../../utils';
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

    if (loading) return (
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading panel details...</p>
            </div>
        </div>
    );
    
    if (error || !panel) return (
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">😔</div>
                <p className="text-gray-600 text-lg">{error || 'Panel not found.'}</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                >
                    Go Back
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    {}
                    <div className="mb-8">
                        <TitleBar
                            text={panel.panelName}
                            buttonLabel={<><span style={{fontSize: '1.2em'}}>&larr;</span> Back</>}
                            onButtonClick={() => navigate(-1)}
                        />
                    </div>

                    {}
                    <div className="grid md:grid-cols-3 gap-8">
                        {}
                        <div className="md:col-span-2 space-y-6">
                            {}
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <TypeBadge 
                                                label={panel.panelType} 
                                                className={TYPE_BADGE_STYLES[panel.panelType] || ''} 
                                            />
                                            {panel.panelTag && (
                                                <TagBadge 
                                                    label={panel.panelTag} 
                                                    className={TAG_BADGE_STYLES[panel.panelTag] || ''} 
                                                />
                                            )}
                                        </div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{panel.panelName}</h1>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-pink-600 mb-1">
                                            {panel.price ? `${panel.price.toLocaleString()} VND` : 'Contact for pricing'}
                                        </div>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <span className="mr-1">⏱</span>
                                            Results in {panel.responseTime}h
                                        </div>
                                    </div>
                                </div>

                                <div className="prose max-w-none">
                                    <p className="text-gray-700 text-lg leading-relaxed">{panel.description}</p>
                                </div>
                            </div>

                            {}
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-pink-100 p-2 rounded-lg mr-3">🧪</span>
                                    Tests Included
                                </h2>
                                
                                {panel.testTypesNames && panel.testTypesNames.length > 0 ? (
                                    <div className="grid gap-4">
                                        {panel.testTypesNames.map((name: string, idx: number) => (
                                            <div key={name} className="bg-gray-50 rounded-xl p-4 border-l-4 border-pink-500">
                                                <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
                                                {panel.testTypesDescriptions && panel.testTypesDescriptions[idx] && (
                                                    <p className="text-gray-600 text-sm leading-relaxed">
                                                        {panel.testTypesDescriptions[idx]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-blue-50 rounded-xl p-6 text-center">
                                        <div className="text-4xl mb-3">🔬</div>
                                        <p className="text-blue-800 font-medium">Comprehensive testing package</p>
                                        <p className="text-blue-600 text-sm mt-1">
                                            Detailed test information will be provided upon booking
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {}
                        <div className="space-y-6">
                            {}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Package Details</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Type</span>
                                        <span className="font-medium text-gray-900">{panel.panelType}</span>
                                    </div>
                                    
                                    {panel.panelTag && (
                                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                            <span className="text-gray-600">Category</span>
                                            <span className="font-medium text-gray-900">{panel.panelTag}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Result Time</span>
                                        <span className="font-medium text-gray-900">{panel.responseTime} hours</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between py-3">
                                        <span className="text-gray-600">Price</span>
                                        <span className="font-bold text-pink-600 text-lg">
                                            {panel.price ? `${panel.price.toLocaleString()} VND` : 'Contact us'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <ActionButton
                                        variant="primary"
                                        actionType="book"
                                        onClick={() => {
                                            navigate('/customer/sti-tests/book', {state: {panelId: panel.id}});
                                        }}
                                        className="w-full py-4 px-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        Book This Package
                                    </ActionButton>
                                </div>
                            </div>

                            {}
                            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                                <h3 className="text-xl font-bold mb-4">Why Choose This Package?</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <span className="mr-3">✅</span>
                                        <span>Fast and accurate results</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-3">✅</span>
                                        <span>Professional healthcare team</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-3">✅</span>
                                        <span>Confidential and secure</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-3">✅</span>
                                        <span>Convenient online booking</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PanelDetail;

