export default function Login({ setIsLoggedIn }) {
  return (
    <div className="flex justify-center items-center w-full h-full bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg"
        />
        <button
          className="w-full bg-purple-500 text-white p-3 rounded-lg"
          onClick={() => setIsLoggedIn(true)}
        >
          Login
        </button>
      </div>
    </div>
  );
}
