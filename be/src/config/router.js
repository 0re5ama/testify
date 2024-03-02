import authRouter from '@/routes/auth';
import indexRouter from '@/routes/index';
import userRouter from '@/routes/user';
import lookupRouter from '@/routes/lookup';
import subjectRouter from '@/routes/subject';
import unitRouter from '@/routes/unit';
import chapterRouter from '@/routes/chapter';
import questionRouter from '@/routes/question';
import questionSetRouter from '@/routes/question-set';

export default function (app) {
    app.use('/api/', indexRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
    app.use('/api/lookup', lookupRouter);
    app.use('/api/subject', subjectRouter);
    app.use('/api/unit', unitRouter);
    app.use('/api/chapter', chapterRouter);
    app.use('/api/question', questionRouter);
    app.use('/api/question-set', questionSetRouter);
}
