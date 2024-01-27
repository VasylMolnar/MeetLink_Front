import "./Chat.scss";
import meetings2 from "../../../../assets/meetings2.jpg";

type ChatProps = {
  chatId: string;
};

const Chat = ({ chatId }: ChatProps) => {
  //i think I make connect with chatId

  console.log(chatId);

  return (
    <div className="meet-link-chat">
      <div className="chats">
        <div className="user-message">
          {/*mabe in here will be Link to user profile */}
          <img className="user-avatar" src={meetings2} alt="user-avatar" />

          <div className="content">
            <div className="about-user">
              <span>Elina</span>
              <time className="time">09:32</time>
            </div>
            Meet Chat all Users "Once upon a time in a pixelated universe, a
            quirky robot named Zara discovered a magical portal hidden behind
            the binary stars. With a zap and a whirl of gears, Zara tumbled into
            a world of floating code and neon dreams. As pixelated butterflies
            danced around, Zara met Byte, the wise coding owl who spoke in loops
            and if-else statements.
          </div>
        </div>

        {/*Its your message */}
        <div className="your-message">
          <div className="content you">
            <div className="about-user">
              <span>You</span>
              <time className="time">09:32</time>
            </div>
            Meet Chat all Users "Once upon a time in a pixelated universe, a
            quirky robot named Zara discovered a magical portal hidden behind
            the binary stars. With a zap and a whirl of gears, Zara tumbled into
            a world of floating code and neon dreams. As pixelated butterflies
            danced around, Zara met Byte, the wise coding owl who spoke in loops
            and if-else statements.
          </div>
        </div>

        <div className="user-message">
          {/*mabe in here will be Link to user profile */}
          <img className="user-avatar" src={meetings2} alt="user-avatar" />

          <div className="content">
            <div className="about-user">
              <span>Elina</span>
              <time className="time">09:32</time>
            </div>
            Meet Chat all Users "Once upon a time in a pixelated universe, a
            quirky robot named Zara discovered a magical portal hidden behind
            the binary stars. With a zap and a whirl of gears, Zara tumbled into
            a world of floating code and neon dreams. As pixelated butterflies
            danced around, Zara met Byte, the wise coding owl who spoke in loops
            and if-else statements.
          </div>
        </div>

        <div className="user-message">
          {/*mabe in here will be Link to user profile */}
          <img className="user-avatar" src={meetings2} alt="user-avatar" />

          <div className="content">
            <div className="about-user">
              <span>Elina</span>
              <time className="time">09:32</time>
            </div>
            Meet Chat all Users "Once upon a time in a pixelated universe, a
            quirky robot named Zara discovered a magical portal hidden behind
            the binary stars. With a zap and a whirl of gears, Zara tumbled into
            a world of floating code and neon dreams. As pixelated butterflies
            danced around, Zara met Byte, the wise coding owl who spoke in loops
            and if-else statements.
          </div>
        </div>

        {/*Its your message */}
        <div className="your-message">
          <div className="content you">
            <div className="about-user">
              <span>You</span>
              <time className="time">09:32</time>
            </div>
            Meet Chat all Users "Once upon a time in a pixelated universe, a
            quirky robot named Zara discovered a magical portal hidden behind
            the binary stars. With a zap and a whirl of gears, Zara tumbled into
            a world of floating code and neon dreams. As pixelated butterflies
            danced around, Zara met Byte, the wise coding owl who spoke in loops
            and if-else statements.
          </div>
        </div>

        {/*Its your message */}
        <div className="your-message">
          <div className="content you">
            <div className="about-user">
              <span>You</span>
              <time className="time">09:32</time>
            </div>
            Meet Chat all Users "Once upon a time in a pixelated universe, a
            quirky robot named Zara discovered a magical portal hidden behind
            the binary stars. With a zap and a whirl of gears, Zara tumbled into
            a world of floating code and neon dreams. As pixelated butterflies
            danced around, Zara met Byte, the wise coding owl who spoke in loops
            and if-else statements.
          </div>
        </div>

        <div className="user-message">
          {/*mabe in here will be Link to user profile */}
          <img className="user-avatar" src={meetings2} alt="user-avatar" />

          <div className="content">
            <div className="about-user">
              <span>Elina</span>
              <time className="time">09:32</time>
            </div>
            Meet Chat all Users "Once upon a time in a pixelated universe, a
            quirky robot named Zara discovered a magical portal hidden behind
            the binary stars. With a zap and a whirl of gears, Zara tumbled into
            a world of floating code and neon dreams. As pixelated butterflies
            danced around, Zara met Byte, the wise coding owl who spoke in loops
            and if-else statements.
          </div>
        </div>

        {/*Its your message */}
        <div className="your-message">
          <div className="content you">
            <div className="about-user">
              <span>You</span>
              <time className="time">09:32</time>
            </div>
            Meet Chat all Users "Once upon a time in a pixelated universe, a
            quirky robot named Zara discovered a magical portal hidden behind
            the binary stars. With a zap and a whirl of gears, Zara tumbled into
            a world of floating code and neon dreams. As pixelated butterflies
            danced around, Zara met Byte, the wise coding owl who spoke in loops
            and if-else statements.
          </div>
        </div>

        <div className="user-message">
          {/*mabe in here will be Link to user profile */}
          <img className="user-avatar" src={meetings2} alt="user-avatar" />

          <div className="content">
            <div className="about-user">
              <span>Elina</span>
              <time className="time">09:32</time>
            </div>
            Meet Chat all Users "Once upon a time in a pixelated universe, a
            quirky robot named Zara discovered a magical portal hidden behind
            the binary stars. With a zap and a whirl of gears, Zara tumbled into
            a world of floating code and neon dreams. As pixelated butterflies
            danced around, Zara met Byte, the wise coding owl who spoke in loops
            and if-else statements.
          </div>
        </div>

        <div className="user-message">
          {/*mabe in here will be Link to user profile */}
          <img className="user-avatar" src={meetings2} alt="user-avatar" />

          <div className="content">
            <div className="about-user">
              <span>Elina</span>
              <time className="time">09:32</time>
            </div>
            Meet Chat all Users "Once upon a time in a pixelated universe, a
            quirky robot named Zara discovered a magical portal hidden behind
            the binary stars. With a zap and a whirl of gears, Zara tumbled into
            a world of floating code and neon dreams. As pixelated butterflies
            danced around, Zara met Byte, the wise coding owl who spoke in loops
            and if-else statements.
          </div>
        </div>

        {/*Its your message */}
        <div className="your-message">
          <div className="content you">
            <div className="about-user">
              <span>You</span>
              <time className="time">09:32</time>
            </div>
            Meet Chat all Users "Once upon a time in a pixelated universe, a
            quirky robot named Zara discovered a magical portal hidden behind
            the binary stars. With a zap and a whirl of gears, Zara tumbled into
            a world of floating code and neon dreams. As pixelated butterflies
            danced around, Zara met Byte, the wise coding owl who spoke in loops
            and if-else statements.
          </div>
        </div>

        {/*Its your message */}
        <div className="your-message">
          <div className="content you">
            <div className="about-user">
              <span>You</span>
              <time className="time">09:32</time>
            </div>
            last Meet Chat all Users "Once upon a time in a pixelated universe,
            a quirky robot named Zara discovered a magical portal hidden behind
            the binary stars. With a zap and a whirl of gears, Zara tumbled into
            a world of floating code and neon dreams. As pixelated butterflies
            danced around, Zara met Byte, the wise coding owl who spoke in loops
            and if-else statements.
          </div>
        </div>
      </div>

      <div className="custom_input">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="svg_icon bi-chat-right-text"
          viewBox="0 0 16 16"
        >
          <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"></path>
          <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path>
        </svg>
        <input
          className="input"
          type="text"
          placeholder="Введіть повідомлення"
        />
      </div>
    </div>
  );
};

export default Chat;
