;; Anonymous Whistleblower Platform

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u102))
(define-constant err-unauthorized (err u103))

;; Data variables
(define-data-var next-submission-id uint u0)

;; Maps
(define-map submissions
  { id: uint }
  {
    encrypted-content: (buff 1024),
    conditions: (list 10 principal),
    revealed: bool
  }
)

(define-map authorized-parties principal bool)

;; Private functions
(define-private (is-authorized (caller principal))
  (default-to false (map-get? authorized-parties caller))
)

;; Public functions
(define-public (add-authorized-party (party principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set authorized-parties party true))
  )
)

(define-public (remove-authorized-party (party principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-delete authorized-parties party))
  )
)

(define-public (submit-whistleblower-info (encrypted-content (buff 1024)) (conditions (list 10 principal)))
  (let
    (
      (submission-id (var-get next-submission-id))
    )
    (asserts! (is-none (map-get? submissions {id: submission-id})) err-already-exists)
    (map-set submissions
      {id: submission-id}
      {
        encrypted-content: encrypted-content,
        conditions: conditions,
        revealed: false
      }
    )
    (var-set next-submission-id (+ submission-id u1))
    (ok submission-id)
  )
)

(define-public (reveal-submission (submission-id uint))
  (let
    (
      (submission (unwrap! (map-get? submissions {id: submission-id}) err-not-found))
      (caller-authorized (is-authorized tx-sender))
    )
    (asserts! (or caller-authorized (is-some (index-of? (get conditions submission) tx-sender))) err-unauthorized)
    (ok (map-set submissions
      {id: submission-id}
      (merge submission {revealed: true})
    ))
  )
)

;; Read-only functions
(define-read-only (get-submission (submission-id uint))
  (match (map-get? submissions {id: submission-id})
    submission (ok {
      revealed: (get revealed submission),
      encrypted-content: (get encrypted-content submission),
      conditions: (get conditions submission)
    })
    (err err-not-found)
  )
)

(define-read-only (is-party-authorized (party principal))
  (ok (is-authorized party))
)

