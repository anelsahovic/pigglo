import z from 'zod';

export const AddNewRelatedPersonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  iconUrl: z.enum([
    '/images/user_icons/user_icon1.png',
    '/images/user_icons/user_icon2.png',
    '/images/user_icons/user_icon3.png',
    '/images/user_icons/user_icon4.png',
    '/images/user_icons/user_icon5.png',
    '/images/user_icons/user_icon6.png',
    '/images/user_icons/user_icon7.png',
    '/images/user_icons/user_icon8.png',
    '/images/user_icons/user_icon9.png',
    '/images/user_icons/user_icon10.png',
  ]),
});

export type AddNewRelatedPersonType = z.infer<typeof AddNewRelatedPersonSchema>;
