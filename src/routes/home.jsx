import demo from '../images/demo-loop.gif'
import example from '../images/example.png'

export default function Root() {
    return (
        <div className="container mx-auto shadow">
            <div className="hero bg-base-100 min-h-[80vh]">
                <div className="hero-content text-center flex-col px-8">
                    <h1 className="text-4xl font-bold">Math Finder</h1>
                    <p className="text-lg">Learn math with your kids, together.</p>

                    <img src={demo} alt="demo" className="w-full" />

                    <a className="btn btn-secondary m-8" href="play" >Start Playing</a>
                </div>
            </div>
            <div className="hero bg-secondary text-secondary-content py-[15%] shadow">
                <div className="hero-content text-start flex-col px-8">
                    <h2 className="text-3xl font-bold my-8">What is Math Finder?</h2>

                    <p>Math Finder is an interactive and printable math app designed to help kids practice the essential math concept of number bonds. With our engaging game, you can bond with your child over math and watch them grow in confidence and fluency.</p>
                </div>
            </div>
            <div className="hero bg-base-100 text-base-100-content py-[15%] shadow">
                <div className="hero-content text-center flex-col px-8">
                    <h2 className="text-3xl font-bold my-8">How Does Math Finder Work?</h2>

                    <p>Math Finder uses interactive exercises to help kids learn number bonds with addition and subtraction. Our app provides a fun and engaging way for kids to practice math concepts in a safe and supportive environment.</p>

                    <img src={example} alt="example 4 + 3 = 7" />
                </div>
            </div>
            <div className="hero bg-secondary text-secondary-content py-[15%] shadow">
                <p className="text-center px-8">Made with ❤️ by <a href="https://ddrscott.github.com/" className="link" target="_blank">Scott</a></p>
            </div>
        </div>
    );
}
