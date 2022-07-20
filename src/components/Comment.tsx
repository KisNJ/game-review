import {
  Stack,
  Title,
  Badge,
  Text,
  Divider,
  Group,
  ActionIcon,
  LoadingOverlay,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import {
  Bucket,
  Plus,
  Edit,
  Minus,
  ChevronDown,
  ChevronUp,
  ArrowNarrowRight,
} from "tabler-icons-react";
import { auth, db } from "../firebase-config";
import React, { useState } from "react";
import ReplyForm from "./ReplyForm";
import { updateDoc, doc } from "firebase/firestore";
import {
  NotificationsProvider,
  showNotification,
  hideNotification,
} from "@mantine/notifications";
import { nanoid } from "nanoid";
import { EditForm } from "./EditForm";
interface Props {
  name: string;
  text: string;
  edited: boolean;
  reply_to: string;
  author_id: string;
  game_id: string;
  index: number;
  close: (index: number, nesting: number) => void;
  calculateMouseOver: (index: number, nesting: number) => void;
  hovered: number[];
  closed: number[];
  replies: any;
}

const Comment: React.FC<Props> = ({
  name,
  text,
  edited,
  reply_to,
  game_id,
  author_id,
  index,
  close,
  calculateMouseOver,
  hovered,
  closed,
  replies,
}) => {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const theme=useMantineTheme()
  function submitComment(text: string) {
    let splitted = reply_to.split("/");
    let zero = splitted[0];
    splitted.shift();
    let path = `replies`;
    for (let i = 0; i < splitted.length; i++) {
      path = path + `.${splitted[i]}.replies`;
    }
    let id = nanoid();
    setVisible(true);
    updateDoc(doc(db, `games/${game_id}/Comments`, reply_to.split("/")[0]), {
      [`${path}.${id}`]: {
        replies: {},
        text: text,
        author_id: auth.currentUser?.uid,
        edited: false,
        name: auth.currentUser?.displayName,
        reply_to: `${reply_to}/${id}`,
      },
    }).then(() => {
      setShowReply(false);
      setVisible(false);
    });
  }
  function deleteComment() {
    let splitted = reply_to.split("/");
    if (splitted.length > 1) {
      let zero = splitted[0];
      splitted.shift();
      let path = `replies`;
      for (let i = 0; i < splitted.length; i++) {
        if (i != splitted.length - 1) {
          path = path + `.${splitted[i]}.replies`;
        } else {
          path = path + `.${splitted[i]}`;
        }
      }
      let id = nanoid();
      // setVisible(true);
      console.log(path);
      updateDoc(doc(db, `games/${game_id}/Comments`, reply_to.split("/")[0]), {
        [`${path}`]: {
          replies: { ...replies },
          text: "[deleted by user]",
          author_id: auth.currentUser?.uid,
          edited: false,
          name: "[deleted by user]",
          reply_to: `${reply_to}`,
        },
      }).then(() => {
        setShowReply(false);
        setVisible(false);
      });
    } else {
      updateDoc(doc(db, `games/${game_id}/Comments`, reply_to.split("/")[0]), {
        replies: { ...replies },
        text: "[deleted by user]",
        author_id: auth.currentUser?.uid,
        edited: false,
        name: "[deleted by user]",
        reply_to: `${reply_to}`,
      }).then(() => {
        setShowReply(false);
        setVisible(false);
      });
    }
  }
  function addComment() {
    if (auth.currentUser === null) {
      console.log("re")
      showNotification({
        onClose: () => hideNotification("msg"),
        color: "red",
        message: "Login to comment",
        id: "msg",
      });
      setShowReply(false);
    } else {
      setShowReply((old) => !old);
    }
  }
  function edit() {
    if (auth.currentUser === null) {
      showNotification({
        onClose: () => hideNotification("msg2"),
        autoClose: 3000,
        color: "red",
        message: "Login to reply",
        id: "msg2",
      });
      setShowEdit(false);
    } else {
      setShowEdit((old) => !old);
    }
  }
  function editComment(text:string) {
    if (auth.currentUser === null) {
      showNotification({
        onClose: () => hideNotification("msg2"),
        autoClose: 3000,
        color: "red",
        message: "Login to reply",
        id: "msg2",
      });
      setShowEdit(false);
    } else {
      
    let splitted = reply_to.split("/");
    if (splitted.length > 1) {
      let zero = splitted[0];
      splitted.shift();
      let path = `replies`;
      for (let i = 0; i < splitted.length; i++) {
        if (i != splitted.length - 1) {
          path = path + `.${splitted[i]}.replies`;
        } else {
          path = path + `.${splitted[i]}`;
        }
      }
      setVisible(true);
      updateDoc(doc(db, `games/${game_id}/Comments`, reply_to.split("/")[0]), {
        [`${path}`]: {
          replies: { ...replies },
          text: text,
          author_id: auth.currentUser?.uid,
          edited: true,
          name:auth.currentUser?.displayName,
          reply_to: `${reply_to}`,
        },
      }).then(() => {
        setShowEdit(false);
        setVisible(false);
      });
    } else {
      updateDoc(doc(db, `games/${game_id}/Comments`, reply_to.split("/")[0]), {
        replies: { ...replies },
        text: text,
        author_id: auth.currentUser?.uid,
        edited: true,
        name: auth.currentUser?.displayName,
        reply_to: `${reply_to}`,
      }).then(() => {
        setShowEdit(false);
        setVisible(false);
      });
    }
    }
  }

  return (
      <NotificationsProvider>
        <div
          style={
            hovered.includes(index)
              ? { boxShadow: "-2px 0px 0px 0px #ADB5BD", padding: "5px" }
              : { padding: "5px" }
          }
          onMouseOver={() =>
            calculateMouseOver(index, reply_to.split("/").length)
          }
        >
          {reply_to?.split("/").length === 1 && (
            <Divider
              onClick={() => close(index, reply_to.split("/").length)}
              label={
                <Title order={3}>
                  <Group>
                    <div>
                  {name} 

                    </div>
                  <div>
                  {edited && <Badge>Edited</Badge>}
                  </div>
                  </Group>
                </Title>
              }
            />
          )}
          <Stack
            spacing={0}
            justify="flex-start"
            ml={(reply_to?.split("/").length - 1) * 10}
          >
            <div
              style={{ padding: "5px" }}
              onClick={() => close(index, reply_to.split("/").length)}
            >
              {reply_to?.split("/").length !== 1 && (
                <Title order={3} style={{ marginBottom: "0" }}>
                  <Group>
                    {Array(
                      reply_to === undefined
                        ? 0
                        : reply_to?.split("/").length - 1
                    ).fill(<ArrowNarrowRight />)}
                    {name} {edited && <Badge>Edited</Badge>}
                  </Group>
                </Title>
              )}
              <Group align="center">
                {replies !== undefined ? (
                  Object.keys(replies).length !== 0 ? (
                    closed.includes(index + 1) ? (
                      <ChevronUp size={48} color={theme.colorScheme==="dark"?"white":"black"} />
                    ) : (
                      <ChevronDown size={48} color={theme.colorScheme==="dark"?"white":"black"}/>
                    )
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
                <Text style={{ fontSize: "20px" }}>{text}</Text>
              </Group>
            </div>
            {auth.currentUser && showReply && (
              <div style={{ position: "relative" }}>
                <LoadingOverlay visible={visible} />
                <ReplyForm submit={submitComment} />
              </div>
            )}
            {auth.currentUser && showEdit && (
              <div style={{ position: "relative" }}>
                <LoadingOverlay visible={visible} />
                <EditForm edit={editComment} text={text} setShowEdit={setShowEdit}/>
              </div>
            )}
            <Group position="right" style={{ height: "48px" }}>
              {text !== "[deleted by user]" && (
                <ActionIcon title="Reply" onClick={() => addComment()}>
                  {showReply ? <Minus size={48} /> : <Plus size={48} />}
                </ActionIcon>
              )}
              {auth.currentUser !== null &&
                auth.currentUser.uid === author_id &&
                text !== "[deleted by user]" && (
                  <ActionIcon title="Edit">
                    <Edit size={48} onClick={edit} />
                  </ActionIcon>
                )}
              {auth.currentUser !== null &&
                auth.currentUser.uid === author_id &&
                text !== "[deleted by user]" && (
                  <ActionIcon variant="filled" color="red" title="Delete">
                    <Bucket size={48} onClick={deleteComment} />
                  </ActionIcon>
                )}
            </Group>
          </Stack>
        </div>
      </NotificationsProvider>
  );
};

export default Comment;
