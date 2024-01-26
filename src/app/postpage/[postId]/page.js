"use client"
import LeftSidebar from '@/Components/LeftSidebar/LeftSidebar'
import PostCard from '@/Components/PostCard/PostCard'
import RightSidebar from '@/Components/RightSidebar/RightSidebar'
import { Box, Button, Heading, Text, Textarea, VStack, useToast } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function page({ params }) {
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [content, setContent] = useState(null)
    const [comments, setComments] = useState(null)
    const { postId } = params;
    const toast = useToast();
    const fetchUserPost = async () => {
        try {
            console.log('Fetching user', postId);
            const response = await fetch('/api/post/getposts/onepost/' + postId, {
                headers: {
                    "token": localStorage.getItem('token')
                },
            })
            const data = await response.json();
            console.log(data)
            if (data.success) {
                setPost(data)
                setComments(data.post.comment)
                console.log(data);
            }
        } catch (error) {
            console.log(error);
            toast({
                title: 'Frroe',
                description: "Error to send data",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }
    useEffect(() => {
        return async () => {
            await fetchUserPost()
        }
    }, [])

    const comment = async () => {
        try {
            const data1 = {
                content
            }
            console.log('Fetching user', postId);
            const response = await fetch('/api/post/comment/' + postId, {
                method: 'POST',
                headers: {
                    "token": localStorage.getItem('token')
                },
                body: JSON.stringify(data1)

            })
            const data = await response.json();
            console.log(data)
            if (data.success) {
                setComments(data.post.comment)
                // window.location.reload()
                setContent('')
                console.log(data);
            }
        } catch (error) {
            console.log(error);
            toast({
                title: 'Frroe',
                description: "Error to send data",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }
    return (

        <Box

            display={'flex'}>
            <LeftSidebar />
            <Box width={{ base: "90%", md: "80%", xl: "40%" }}
                padding="15px"
                height={"88vh"}
                overflow={"scroll"}
            >
                {post && <PostCard post={post.post} />}
                <Text>
                    Comments
                </Text>
                <Textarea
                    onChange={(e)=> setContent(e.target.value)}
                    rows={4}
                    value={content}
                />
                <Button
                    marginTop={'10px'}
                    onClick={comment}
                    value={content}
                >
                    Comment
                </Button>
                <VStack>
                    {comments && comments.map((com) => {
                        return (<Box
                            width={'100%'}
                            border={'2px solid #344502'}
                            borderRadius={'20px'}
                            margin={'10px'}
                            cursor={'pointer'}
                            onClick={() => {
                                router.push('/profile/'+ com.username)
                            }}
                        >
                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                color={'#344502'}
                            >
                                <Box
                                    padding={"10px"}
                                >
                                    <Image src={com.pic || '/imgDef.jpg'} width={60} height={60} style={{ width: '60px', height: '60px', clipPath: "circle()" }} />
                                </Box>
                                <Box>
                                    <Text fontSize={'16px'} fontWeight={'bold'}>
                                        {com.name}
                                    </Text>
                                    <Text fontSize={'16px'}>
                                        {com.username}
                                    </Text>
                                </Box>
                            </Box>
                            <hr />
                            <Text
                                margin={"10px"}
                            >
                                {com.content}
                            </Text>
                        </Box>)
                    })
                        }
                </VStack>
            </Box>
            <RightSidebar />
        </Box>
    )
}
