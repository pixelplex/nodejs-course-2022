/* eslint-disable @typescript-eslint/no-empty-function */
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';

import * as jwt from 'jsonwebtoken';

import { isAuth } from '@middleware';
import { describe } from 'mocha';
import { AppError } from '@errors';
import { NextFunction, Request, Response } from 'express';

describe('middleware/is-auth.ts', () => {
  describe('Calls "next()" with AppError if:', () => {
    it('- no "Authorization" header applied', () => {
      const req = {
        get: (): null => {
          return null;
        },
      };

      const next = (error?: AppError): void => {};

      const nextSpy = sinon.spy(next);

      isAuth(req as unknown as Request, {} as Response, nextSpy as unknown as NextFunction);

      expect(nextSpy.calledWith(sinon.match.instanceOf(AppError))).to.equal(true);
      expect(nextSpy.calledWith(sinon.match.has('message', 'Authorization header is missing'))).to.equal(true);
    });

    it('- token has no value', () => {
      const req = {
        get: (): null | string => {
          return '';
        },
      };

      const next = (error?: AppError): void => {};

      const nextSpy = sinon.spy(next);

      isAuth(req as unknown as Request, {} as Response, nextSpy as unknown as NextFunction);

      expect(nextSpy.calledWith(sinon.match.instanceOf(AppError))).to.equal(true);
      expect(nextSpy.calledWith(sinon.match.has('message', 'Authorization header is missing'))).to.equal(true);
    });

    it('- "Authorization" header is invalid', () => {
      const req = {
        get: (): null | string => {
          return '- 38 q4 8  jadf';
        },
      };

      const next = (error?: AppError): void => {};

      const nextSpy = sinon.spy(next);

      isAuth(req as unknown as Request, {} as Response, nextSpy as unknown as NextFunction);

      expect(nextSpy.calledWith(sinon.match.instanceOf(AppError))).to.equal(true);
      expect(nextSpy.calledWith(sinon.match.has('message', 'Invalid authorization header'))).to.equal(true);
    });
  });

  it('Yields userId after decoding the token', function () {
    const req = {
      get: (): string => {
        return 'Bearer djfkalsdjfaslfjdlas';
      },
    };

    const next = (error?: AppError): void => {};

    const verifyStub = sinon.stub(jwt, 'verify').callsFake(() => {
      return { userId: 1 };
    });

    isAuth(req as unknown as Request, {} as Response, next as NextFunction);

    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 1);
    verifyStub.restore();
  });

  it('should throw an error if the token cannot be verified', function () {
    const req = {
      get: (): string => {
        return 'Bearer xyz';
      },
    };
    const next = (error?: AppError): void => {};
    const nextSpy = sinon.spy(next);

    isAuth(req as unknown as Request, {} as Response, nextSpy as unknown as NextFunction);

    expect(nextSpy.calledWith(sinon.match.instanceOf(AppError))).to.equal(true);
    expect(nextSpy.calledWith(sinon.match.has('message', 'Invalid authorization token'))).to.equal(true);
  });
});
