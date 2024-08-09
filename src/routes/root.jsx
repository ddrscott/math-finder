import demo from '../images/demo.gif'

export default function Root(...args) {
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Math Finder</h1>
            <img src={demo} alt="demo" className="w-full" />
            <p className="pt-1 pb-6">
              Make your kids smarter without them knowing it!
            </p>

            <a className="btn btn-primary" href="play" >Play</a>
          </div>
        </div>
      </div>
      <div className="hero bg-base-500 min-h-screen">
        Hello
      </div>
    </>
  );
}
