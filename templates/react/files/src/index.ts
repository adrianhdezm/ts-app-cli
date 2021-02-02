import '@assets/styles.css';

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <h1>Hello Vanilla!</h1>
    <div>We use Webpack to bundle this application.</div>
`;
}
