import demo from '../images/demo-loop.gif'
import example from '../images/example.png'

export default function Root() {
    return (
        <div className="container mx-auto shadow">
            <div className="hero bg-base-100 min-h-[80vh]">
                <div className="hero-content text-center flex-col px-8">
                    <h1 className="text-4xl font-bold">Math Finder</h1>

                    "Bond" with your kids by finding math together! 

                    <img src={demo} alt="demo" className="w-full" />

                    <a className="btn btn-secondary m-8" href="play.html" >Start Searching</a>
                </div>
            </div>
            <div className="hero bg-secondary text-secondary-content py-[15%] shadow">
                <div className="hero-content text-start flex-col px-8">
                    <h2 className="text-3xl font-bold my-8">What's Math Finder?</h2>
                    <p>Math Finder is a fun app that helps kids learn addition bonds in an interactive or printable way. Just like solving a word search, we search for numbers that add up to make the equation true!</p>
                </div>
            </div>
            <div className="hero bg-base-100 text-base-100-content py-[15%] shadow">
                <div className="hero-content text-center flex-col px-8">
                    <h2 className="text-3xl font-bold my-8">How Does it Work?</h2>

                    <p>Math Finder uses a grid where we find numbers that add up make the addition bond! For instance, we search for <code class="code">4 + 3 = 7</code>, or any other addition bond. When we find it, circle it. Try to find them all!</p>

                    <img src={example} alt="example 4 + 3 = 7" />
                </div>
            </div>
            <div className="hero bg-secondary text-secondary-content py-[15%] shadow">
                <p className="text-center px-8">Made with ❤️ by <a href="https://ddrscott.github.com/" className="link" target="_blank">Scott</a>, for my kids and yours!</p>
            </div>
        </div>
    );
}
