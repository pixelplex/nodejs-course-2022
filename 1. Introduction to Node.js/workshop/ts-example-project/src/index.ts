import moment from 'moment';
function hello(name: string = 'world'): void {
  // eslint-disable-next-line no-console
  console.log(`Hello ${name}`);
  // eslint-disable-next-line no-console
  console.log(moment());
}
function timeout(): void {
  setTimeout(function () {
    hello();
    timeout();
  }, 1000);
}
timeout();
