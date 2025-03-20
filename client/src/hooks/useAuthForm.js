import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const useAuthForm = () => {
    const authSchema = z.object({
        username: z.string().min(1, 'Имя пользователя обязательно').regex(/^[a-zA-Z0-9_]+$/, 'Имя пользователя может содержать только буквы, цифры и символы подчёркивания').optional(),
        email: z.string().min(1, 'Email обязателен').email('Некорректный email'),
        password: z.string().min(1, 'Пароль обязателен').min(6, 'Пароль слишком короткий'),
        confirmPassword: z.string().min(6, 'Повторите пароль').optional(),
    }).refine((data) => {
        if (data.confirmPassword) {
            return data.password === data.confirmPassword
        } else {
            return true
        }
    }, {
        message: 'Пароли должны совпадать',
        path: ['confirmPassword'],
    })
    
    return useForm({
        mode: 'onChange',
        resolver: zodResolver(authSchema),
    })
}

