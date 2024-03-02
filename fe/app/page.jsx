'use client';
import { faCopy, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { baseURL } from './api';
import Tikz from './components/Tikz';
import QuestionForm from './form/QuestionForm';

export default function Home() {
    const [subjectId, setSubjectId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [mode, setMode] = useState('add');
    const [question, setQuestion] = useState(null);

    const duplicate = async (id) => {
        try {
            let res = await axios.get(`${baseURL}/question/${id}`);
            setMode('add');
            setQuestion(res.data);
        } catch (err) {
            toast(err);
        }
    };

    const duplicateLatest = async () => {
        duplicate(questions[0].id);
    };

    const edit = async (id) => {
        try {
            let res = await axios.get(`${baseURL}/question/${id}`);
            setMode('edit');
            setQuestion(res.data);
        } catch (err) {
            toast(err);
        }
    };

    const fetchQuestions = async (id) => {
        let res = await axios.get(`${baseURL}/chapter/${id}/questions`);
        setQuestions(res.data.rows);
    };

    return (
        <MathJaxContext
            config={{
                tex: {
                    inlineMath: [
                        ['$', '$'],
                        ['\\(', '\\)'],
                    ],
                    processEscapes: true,
                },
            }}
        >
            <main className="flex min-h-screen flex-col justify-start">
                <ToastContainer />
                <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                    <h2>Question</h2>
                </div>
                <div className="row">
                    <QuestionForm
                        fetchQuestions={fetchQuestions}
                        subId={subjectId}
                        currQuestion={question}
                        mode={mode}
                        duplicater={duplicateLatest}
                        setMode={setMode}
                    />
                </div>
                <section className="question-list">
                    <ol className="question-list">
                        {questions &&
                            questions.map((q, i) => (
                                <li className="flex justify-between" key={i}>
                                    <div className="mr-3">
                                        {questions.length - i}.{' '}
                                    </div>
                                    <MathJax>{q.desc}</MathJax>
                                    <div>
                                        <button
                                            onClick={async () => {
                                                await edit(q.id);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                await duplicate(q.id);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCopy} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                    </ol>
                </section>
                <Tikz />
            </main>
        </MathJaxContext>
    );
}
