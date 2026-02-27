import React from 'react';
import KanaPage from '../../components/common/KanaPage/KanaPage';
import { katakana } from '../../data/katakana';

export default function Katakana() {
    return <KanaPage section="katakana" data={katakana} />;
}
