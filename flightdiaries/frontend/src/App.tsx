import { useState, useEffect } from 'react';
import axios from 'axios';
import type {
  NonSensitiveDiaryEntry,
  NewDiaryEntry,
  Weather,
  Visibility
} from './types';
import { weatherOptions, visibilityOptions } from './types';
import diaryService from './diaryService';

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather | ''>('');
  const [visibility, setVisibility] = useState<Visibility | ''>('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    diaryService.getAll().then(data => {
      setDiaries(data);
    });
  }, []);

  const notify = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (weather === '' || visibility === '') {
      notify('Please select weather and visibility');
      return;
    }

    const newEntry: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment
    };

    diaryService
      .create(newEntry)
      .then(returnedEntry => {
        setDiaries(diaries.concat(returnedEntry));
        setDate('');
        setWeather('');
        setVisibility('');
        setComment('');
      })
      .catch((e: unknown) => {
        if (axios.isAxiosError(e)) {
          if (Array.isArray(e.response?.data?.error)) {
            const messages = e.response.data.error
              .map((issue: { path: string[]; message: string }) =>
                `${issue.path.join('.')}: ${issue.message}`
              )
              .join(' | ');
            notify(messages);
          } else {
            notify(e.message);
          }
        } else {
          notify('Unknown error');
        }
      });
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={addDiary}>
        <div>
          date
          <input
            type="date"
            value={date}
            onChange={event => setDate(event.target.value)}
          />
        </div>

        <div>
          weather
          {weatherOptions.map(option => (
            <label key={option} style={{ marginLeft: '0.5em' }}>
              <input
                type="radio"
                name="weather"
                checked={weather === option}
                onChange={() => setWeather(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div>
          visibility
          {visibilityOptions.map(option => (
            <label key={option} style={{ marginLeft: '0.5em' }}>
              <input
                type="radio"
                name="visibility"
                checked={visibility === option}
                onChange={() => setVisibility(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div>
          comment
          <input value={comment} onChange={event => setComment(event.target.value)} />
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      {diaries.map(diary => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <div>visibility: {diary.visibility}</div>
          <div>weather: {diary.weather}</div>
        </div>
      ))}
    </div>
  );
};

export default App;