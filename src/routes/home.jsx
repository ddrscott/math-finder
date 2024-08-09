import demo from '../images/demo-loop.gif'
import example from '../images/example.png'

export default function Root(...args) {
    return (
        <>
            <div className="hero bg-base-100 min-h-[80vh]">
                <div className="hero-content text-center flex-col md:flex-row">
                    <p>
                        <h1 className="text-4xl font-bold pb-8">Math Finder</h1>
                        "Bond" with your kids by finding math problems together.
                        They get smarter, you get closer.
                    </p>

                    <p>
                        <img src={demo} alt="demo" className="w-full" />
                        <a className="btn btn-secondary m-8" href="play" >Free Play</a>
                    </p>
                </div>
            </div>
            <div className="hero bg-secondary text-secondary-content py-[15%] shadow">
                <div className="hero-content text-start">
                    <p>
                        <h2 className="text-2xl font-bold my-8">What is a number bond?</h2>
                        A number bond are 2 numbers that add up to another number. For example, 3 and 2 are a number bond for 5.
                        They also work in the other direction for instance, 5 minus 3 is 2.
                        <br/><br/>
                        Number bonds are essential for fluency in math. This app helps kids learn number bonds in a fun and interactive way.
                        <br />
                    </p>
                    <p>
                        <img src={example} alt="example 4 + 3 = 7" className="w-full" />
                        <a className="btn btn-secondary-content m-8" href="play" >Let's Play!</a>
                    </p>
                </div>
            </div>
            <div className="hero bg-base-100 text-base-100-content py-[15%] shadow">
                <p className="text-center">
                    Made with ❤️  by <a className="link mx-0" href="https://ddrscott.github.io/">Scott</a>
                    <br />
                    <br />
                    For the traditional printable worksheets try <a className="link" href="https://mathing.vercel.app" target="_blank">Mathing</a>.
                </p>
            </div>
        </>
    );
}
