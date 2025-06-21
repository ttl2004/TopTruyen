import './Content.css';
import MainContent from './MainContent';
import LoginContent from './LoginContent';
import RegisterContent from './RegisterContent';
import ForgotPassContent from './ForgotPassContent';
import {Routes, Route } from 'react-router-dom';
import UserMain from '../user/userMain';
import HistoryStory from './HistoryStory/index';
import ReadStory from './ReadStory/ReadStory';
import GtStory from './ReadStory/GtStrory';
import SearchStory from './SearchStory/index';
import FollowStory from './FollowStory';

function Content() {
  return (
    <>
        <div className='content'>
            <Routes>
                <Route path='/' element={<MainContent />} />
                <Route path='/login' element={<LoginContent />} />
                <Route path='/register' element={<RegisterContent />} />
                <Route path='/forgotPass' element={<ForgotPassContent />} />
                <Route path='/user' element={<UserMain />} />
                <Route path='/history' element={<HistoryStory />} />
                <Route path='/read/:storyId/:chapterId' element={<ReadStory />} />
                <Route path='/read/:storyId' element={<GtStory />} />
                <Route path='/SearchStory' element={<SearchStory />} />
                <Route path='/followStory' element={<FollowStory />} />
            </Routes>
        </div>
    </>
  );
}

export default Content;