import { useEffect, useState } from 'react'
import { employeeAPI } from '../lib/api'

const normalizeEmployees = (payload) => {
  if (Array.isArray(payload)) return payload
  return (
    payload?.content ||
    payload?.employees ||
    payload?.items ||
    payload?.data ||
    []
  )
}

const normalizePayload = (payload) => {
  if (!payload) return null
  if (payload?.data && (Array.isArray(payload.data) || payload.data?.content || payload.data?.employees)) {
    return payload.data
  }
  return payload
}

const extractPagination = (payload, page, size, listLength) => {
  const total =
    payload?.totalElements ??
    payload?.total ??
    payload?.count ??
    payload?.pagination?.total ??
    null
  const totalPages =
    payload?.totalPages ??
    payload?.pagination?.totalPages ??
    (total !== null ? Math.ceil(total / size) : null)
  const currentPage =
    (payload?.number ?? payload?.page ?? payload?.pagination?.page ?? page - 1) + 1
  const pageSize =
    payload?.size ?? payload?.pagination?.size ?? size

  const hasNext = totalPages !== null ? currentPage < totalPages : listLength === pageSize
  const hasPrev = currentPage > 1

  return {
    total,
    totalPages,
    page: currentPage,
    size: pageSize,
    hasNext,
    hasPrev,
  }
}

export const useEmployees = ({ limit, page = 1, size, enabled = true } = {}) => {
  const pageSize = size ?? limit ?? 10
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({
    total: null,
    totalPages: null,
    page,
    size: pageSize,
    hasNext: false,
    hasPrev: false,
  })

  useEffect(() => {
    if (!enabled) return
    let isActive = true
    setLoading(true)
    setError('')
    employeeAPI
      .list({ page: Math.max(page - 1, 0), size: pageSize })
      .then((data) => {
        if (!isActive) return
        const normalized = normalizePayload(data)
        const list = normalizeEmployees(normalized)
        let nextPagination = extractPagination(normalized, page, pageSize, list.length)
        let displayList = list

        const shouldClientPaginate =
          nextPagination.total === null &&
          nextPagination.totalPages === null &&
          list.length > pageSize

        if (shouldClientPaginate) {
          const start = Math.max(0, (page - 1) * pageSize)
          const end = start + pageSize
          displayList = list.slice(start, end)
          const totalPages = Math.max(1, Math.ceil(list.length / pageSize))
          nextPagination = {
            total: list.length,
            totalPages,
            page,
            size: pageSize,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          }
        } else if (limit) {
          displayList = list.slice(0, limit)
        }

        setEmployees(displayList)
        setPagination(nextPagination)
      })
      .catch((err) => {
        if (!isActive) return
        console.error('Failed to load employees', err)
        setEmployees([])
        setError('Failed to load employees.')
        setPagination((prev) => ({
          ...prev,
          hasNext: false,
          hasPrev: page > 1,
        }))
      })
      .finally(() => {
        if (!isActive) return
        setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [limit, page, pageSize, enabled])

  return { employees, loading, error, pagination }
}
