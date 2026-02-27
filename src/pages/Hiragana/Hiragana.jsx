import React from 'react';
import KanaPage from '../../components/common/KanaPage/KanaPage';
import { hiragana } from '../../data/hiragana';

export default function Hiragana() {
    return <KanaPage section="hiragana" data={hiragana} />;
}
